<template>
  <MyMapPlacement
    class="my-map-pointer"
    placement="left-bottom"
    v-bind="$attrs"
  >
    <div>
      <span>{{ coordinate.join(", ") }}</span>
      <span
        class="icon fa fa-lock"
        v-if="lock"
        title="解锁"
        @click="unlock"
      ></span>
    </div>
  </MyMapPlacement>
</template>

<script>
import MyMapPlacement from "./Placement";

export default {
  name: "MyMapPointer",
  inject: ["myMap"],
  components: { MyMapPlacement },
  props: {
    precision: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      coordinate: [0, 0],
      lock: false
    };
  },
  methods: {
    init() {
      const map = this.myMap.map;
      if (map) {
        this.update({ coordinate: this.myMap.map.getView().getCenter() });
        map.on("pointermove", this.move);
        map.on("click", this.pick);
      }
    },
    pick(e) {
      this.lock = true;
      this.update(e);
    },
    move(e) {
      if (!this.lock) {
        this.update(e);
      }
    },
    update(e) {
      let coordinate = e.coordinate;
      if (coordinate) {
        this.coordinate = this.myMap.map
          .outputCoordinate(coordinate)
          .map(x => x.toFixed(this.precision));
      }
    },
    unlock() {
      this.lock = false;
    }
  },
  mounted() {
    this.myMap.mapReady(this.init);
  },
  beforeDestroy() {
    if (this.myMap && this.myMap.map) {
      const map = this.myMap.map;
      map.un("pointermove", this.move);
      map.un("click", this.pick);
    }
  }
};
</script>

<style lang="less">
@import "../../style/pointer.less";
</style>
