<template>
  <div class="my-map-multiMap">
    <div
      class="my-map-multiMap-item"
      v-for="index of num"
      :key="index"
      :style="itemStyle"
    >
      <div v-if="layers[index - 1]" class="my-map-multiMap-item-name">
        {{ layers[index - 1].name }}
      </div>
      <my-map
        :isDefaultBaseLayer="false"
        @ready="initMap($event, index)"
      ></my-map>
    </div>
  </div>
</template>

<script>
import MyMap from "./Map.vue";

export default {
  name: "MyMapMultiMap",
  components: {
    MyMap
  },
  props: {
    num: {
      type: Number,
      default: 1
    },
    layers: {
      type: Array,
      default: () => {
        return [];
      }
    },
    col: {
      // 默认与num一致
      type: Number,
      default: null
    }
  },
  data() {
    return {
      multiMaps: {},
      view: null
    };
  },
  computed: {
    itemStyle() {
      let col = this.col ? Math.min(this.col, this.num) : this.num;
      let width = 100 / col;
      return { width: `${width}%` };
    }
  },
  mounted() {},
  methods: {
    initMap(map, index) {
      this.$set(this.multiMaps, index - 1, map);
      map.setBaseLayers([this.layers[index - 1]]);
      if (index === 1) {
        this.view = map.getView();
      } else {
        this.view && map.setView(this.view);
      }
    },
    updateMapByIndex(index, data) {
      let map = this.multiMaps[index];
      if (map) {
        map.setBaseLayers([data]);
      }
    }
  },
  beforeDestroy() {
    this.multiMaps = {};
    this.view = null;
  }
};
</script>

<style lang="less">
.my-map-multiMap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  .my-map-multiMap-item {
    // flex: 1;
    padding: 5px;
    box-sizing: border-box;
    border: 1px solid #000;
    .my-map-multiMap-item-name {
      position: absolute;
      top: 6px;
      z-index: 999999;
      padding: 5px 10px;
      background-color: #ecf5ff;
      color: #409eff;
    }
  }
}
</style>
