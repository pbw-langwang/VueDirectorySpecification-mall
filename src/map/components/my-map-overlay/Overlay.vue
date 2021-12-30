<template>
  <div class="my-map-overlay">
    <slot></slot>
  </div>
</template>

<script>
import DxOverlay from "@map/js/layer/overlay";
export default {
  name: "MyMapOverlay",
  inject: ["myMap"],
  props: {
    options: {
      type: Object,
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      overlay: null,
    };
  },
  watch: {
    options() {
      if (this.options && this.overlay) {
        let offset = this.options.offset;
        offset && this.overlay.setOffset(offset);
        let positioning = this.options.positioning;
        positioning && this.overlay.setPositioning(positioning);
      }
    },
  },
  methods: {
    init() {
      const opts = {
        ...this.options,
        element: this.$el,
      };
      this.overlay = new DxOverlay(opts);

      this.myMap.map.addOverlay(this.overlay);
      this.setPosition(opts.position || undefined);
    },
    setPosition(position) {
      if (!this.overlay) {
        this.init();
      }

      if (!this.overlay.getMap()) {
        // 防止map 移除overlayer
        this.overlay.setMap(this.myMap.map);
      }
      
      this.overlay.setPosition(position || undefined);

      if (position) {
        this.overlay.panIntoView({
          margin: this.options.autoPanMargin || 20,
        });
      }
    },
    dispose() {
      if (this.overlay && this.myMap && this.myMap.map) {
        this.myMap.map.removeOverlay(this.overlay);
        this.overlay = null;
      }
    },
  },
  mounted() {
    this.myMap.mapReady(this.init);
  },
  beforeDestroy() {
    this.dispose();
  },
};
</script>
