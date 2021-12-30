<template>
  <div :class="classes" style="width:100%;height:100%;">
    <slot></slot>
  </div>
</template>

<script>
import { CONFIG_VIEW, CONFIG_LAYERS } from "@map/config";
import DxMap from "@map/js/map";
import { registerProj } from "@map/js/projections";

export default {
  name: "MyMap",
  provide: function() {
    return {
      myMap: this
    };
  },
  props: {
    pmap: {
      type: Object,
      default: () => {
        return null;
      }
    },
    isDefaultBaseLayer: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      map: null
    };
  },
  computed: {
    classes: function() {
      return {
        "my-map": true
      };
    }
  },
  mounted() {
    this.mapReady();
  },
  methods: {
    init() {
      if (this.pmap) {
        this.map = this.pmap;
        this.map.setTarget(this.$el);
        return;
      }
      this.map = new DxMap({
        target: this.$el,
        layers: this.isDefaultBaseLayer ? CONFIG_LAYERS : [],
        ...CONFIG_VIEW
      });

      this.map.addPointerHandle({
        click: this.clickEvent,
        pointermove: this.pointmoveEvent
      });

      /**
       * 地图初始化完成时触发
       */
      this.$emit("ready", this.map);
    },
    /**
     * 地图初始化完成回调
     * @param callback
     */
    mapReady(callback) {
      if (!this.map) {
        registerProj();
        this.init();
      }

      callback && callback(this.map, this);
    },
    // 获取要素所在图层的组件实例
    getFeatureVM(feature) {
      if (feature && feature._layer && feature._layer._vm) {
        return feature._layer._vm;
      }
    },
    // 获取要素所在图层
    getFeatureLayer(feature) {
      if (feature) {
        return feature._layer;
      }
    },
    /**
     * 通过某一点坐标查找要素，定位，并弹出详情框
     */
    findFeatureByCoordinate(coordinate) {
      if (!coordinate) {
        return;
      }

      let feature = this.map.getFeatureByCoordinate(coordinate);
      if (feature) {
        this.clickEvent({ feature });
        this.map.getView().setCenter(coordinate);
      }
    },
    /**
     * 地图点击事件回调函数，捕捉到要素时触发要素所在图层的vm的click事件
     * @param {Object} options
     * @param {import("ol/Feature")} options.feature - 要素,包含_layer,outGeometry属性
     * @param {import("ol/MapBrowserEvent")} opeions.e - 事件
     */
    clickEvent({ feature, e }) {
      if (feature) {
        let vm = this.getFeatureVM(feature); // 要素对应图层所在的vue实例
        vm && vm.$emit(e.type, e, feature); // 触发实例的事件
      } else {
        this.$emit("nullselect", null);
      }
    },
    pointmoveEvent({ feature, e }) {
      // 无 -> 有 ，鼠标进入
      if (!this.oldFeature && feature) {
        let layer = this.getFeatureLayer(feature);
        if (layer && layer.pointerenter) {
          layer.pointerenter(feature);
        }
      }

      // 有 -> 无 ，鼠标移除
      if (this.oldFeature && !feature) {
        let layer = this.getFeatureLayer(this.oldFeature);
        if (layer && layer.pointerleave) {
          layer.pointerleave(this.oldFeature);
        }
      }

      // 一个到另一个，先出后进
      if (this.oldFeature && feature && this.oldFeature !== feature) {
        let layer1 = this.getFeatureLayer(this.oldFeature);
        if (layer1 && layer1.pointerleave) {
          layer1.pointerleave(this.oldFeature);
        }

        let layer = this.getFeatureLayer(feature);
        if (layer && layer.pointerenter) {
          layer.pointerenter(feature);
        }
      }

      // 更新
      this.oldFeature = feature;
    },
    /**
     * 根据图层的键值对，找到指定的图层，进行交换
     * @param {string} key 键
     * @param {*} value1  值1
     * @param {*} value2  值2
     */
    swapLayerBykey(key, value1, value2) {
      if (this.map && key && value1 && value2) {
        let index1 = this.map.getLayerIndexByKey(key, value1);
        let index2 = this.map.getLayerIndexByKey(key, value2);
        if (index1 != -1 && index2 != -1) {
          this.map.swapLayerByIndex(index1, index2);
        }
      }
    },
    /**
     * 根据图层的键值对，找到指定的图层，将图层上移一位
     * @param {string} key 键
     * @param {*} value  值
     */
    upLayerByKey(key, value) {
      if (this.map && key && value) {
        let index1 = this.map.getLayerIndexByKey(key, value);
        let index2 = value - 1;
        if (index1 != -1 && index2 != -1) {
          this.map.swapLayerByIndex(index1, index2);
        }
      }
    },
    /**
     * 根据图层的键值对，找到指定的图层，将图层下移一位
     * @param {string} key 键
     * @param {*} value  值
     */
    downLayerByKey(key, value) {
      if (this.map && key && value) {
        let index1 = this.map.getLayerIndexByKey(key, value);
        let index2 = value + 1;
        if (index1 != -1 && index2 != -1) {
          this.map.swapLayerByIndex(index1, index2);
        }
      }
    }
  }
};
</script>

<style lang="less">
@import "../../style/map.less";
</style>
