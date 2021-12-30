<template>
  <div class="my-map-swipe" :class="[vertical ? 'vertical' : 'horizontal']">
    <div class="slider" v-if="firstLayer && secondLayer">
      <el-slider
        v-model="slider"
        :show-tooltip="false"
        :vertical="vertical"
        height="100%"
        @change="changeSwipe"
      ></el-slider>
    </div>
    <div
      class="split-line"
      v-if="firstLayer && secondLayer"
      :style="{
        left: vertical ? 0 : `${slider}%`,
        top: vertical ? `${100 - slider}%` : 0,
      }"
    ></div>
  </div>
</template>

<script>
import { getImageLayer } from "@map/js/layer";

export default {
  name: "MyMapSwipe",
  inject: ["myMap"],
  props: ["first", "second", "vertical"],
  data() {
    return {
      slider: 50,
      firstLayer: null,
      secondLayer: null,
    };
  },
  watch: {
    first: {
      handler: function(value) {
        if (value) {
          this.changeLayer(0, value);
        } else {
          this.removeLayer(this.firstLayer);
          this.firstLayer = null;
        }
      },
      deep: true,
    },
    second: {
      handler: function(value) {
        if (value) {
          this.changeLayer(1, value);
        } else {
          this.removeLayer(this.secondLayer);
          this.secondLayer = null;
        }
      },
      deep: true,
    },
    vertical: function() {
      let map = this.myMap.map;
      map.render();
    },
  },
  mounted() {
    this.myMap.mapReady(this.init);
  },
  methods: {
    async init() {
      if (!this.first || !this.second) {
        return;
      }

      let map = this.myMap.map;
      map.clear();
      map.clearBaseLayer();
      this.firstLayer = await map.addImageLayer(this.first);
      this.secondLayer = await map.addImageLayer(this.second);

      if (this.secondLayer) {
        this.listenEvent();
      }
    },
    listenEvent() {
      this.secondLayer.on("prerender", (event) => {
        var ctx = event.context;
        var width = ctx.canvas.width * (this.slider / 100);
        var height = ctx.canvas.height * (this.slider / 100);
        ctx.save();
        ctx.beginPath();
        if (this.vertical) {
          ctx.rect(0, ctx.canvas.height - height, ctx.canvas.width, height);
        } else {
          ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height);
        }

        ctx.clip();
      });

      this.secondLayer.on("postrender", (event) => {
        var ctx = event.context;
        ctx.restore();
      });
    },
    async changeLayer(index, value) {
      let map = this.myMap.map;
      let layer = await getImageLayer(value);
      map.getLayers().setAt(index + 1, layer);
      if (index === 1) {
        this.secondLayer = layer;
        if (this.secondLayer) {
          this.listenEvent();
        }
      } else {
        this.firstLayer = layer;
      }
    },
    removeLayer(layer) {
      let map = this.myMap.map;
      map.removeLayer(layer);
    },
    changeSwipe(value) {
      if (!this.secondLayer) {
        return;
      }
      this.slider = value;

      let map = this.myMap.map;
      map.render();
    },
  },
};
</script>

<style lang="less">
.my-map-swipe {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;

  .slider {
    position: absolute;
    pointer-events: auto;
  }
  .split-line {
    position: absolute;
    background-color: #409eff;
  }

  &.vertical {
    .slider {
      left: 50%;
      height: 100%;
      .el-slider {
        height: 100%;
      }
    }
    .split-line {
      width: 100%;
      height: 2px;
      transform: translateY(-1px);
    }
  }
  &.horizontal {
    .slider {
      top: 50%;
      width: 100%;
    }
    .split-line {
      height: 100%;
      width: 2px;
      transform: translateX(-1px);
    }
  }
}
</style>
