<template>
  <div class="my-map-contextmenu">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MyMapContextmenu",
  inject: ["myMap"],
  provide: function() {
    return {
      myMap: this.myMap
    };
  },
  props: {
    isDefault: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    if (this.isDefault) {
      this.myMap.mapReady(this.init);
    }
  },
  methods: {
    async init() {
      let map = this.myMap.map;
      map.getViewport().addEventListener("contextmenu", this.showContextmenu);
      map.on("click", this.hideContextmenu);
    },
    showContextmenu(e) {
      e.preventDefault();

      this.$el.style.display = "unset";
      this.$el.style.left = e.offsetX + "px";
      this.$el.style.top = e.offsetY + "px";

      let map = this.myMap.map;
      if (map) {
        let coordinate = map.getEventCoordinate(e);
        coordinate = map.outputCoordinate(coordinate);
        this.$emit("callback", coordinate);
      }
    },
    hideContextmenu() {
      this.$el.style.display = "none";
    },
    disposed() {
      let map = this.myMap.map;
      if (map) {
        map
          .getViewport()
          .removeEventListener("contextmenu", this.showContextmenu);
        map.un("click", this.hideContextmenu);
      }
    }
  },
  beforeDestroy() {
    this.disposed();
  }
};
</script>

<style lang="less" scoped>
.my-map-contextmenu {
  position: absolute;
  z-index: 99999999;
  display: none;
}
</style>
