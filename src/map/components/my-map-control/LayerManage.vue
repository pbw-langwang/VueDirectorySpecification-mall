<!-- 图层管理器，排除底图 -->
<template>
  <MyMapPlacement
    class="my-map-layerManage"
    placement="right-top"
    v-bind="$attrs"
  >
    <div class="container" v-if="localLayers.length > 1">
      <div class="title">图层管理</div>
      <template v-for="(item, index) in localLayers">
        <!--排除底图-->
        <div v-if="index > 0" class="item" :key="index">
          <div class="checkbox">
            <input
              type="checkbox"
              :checked="item.getVisible()"
              @click="changeVisible(index)"
            />
          </div>
          <div class="name" :title="item.name || `图层${index}`">{{ item.name || `图层${index}` }}</div>
          <div class="operate">
            <span
              class="icon fa fa-arrow-up"
              v-if="index > 1"
              title="上移"
              @click="upLayer(index)"
            ></span>
            <span
              class="icon fa fa-arrow-down"
              v-if="index < layers.length - 1"
              title="下移"
              @click="downLayer(index)"
            ></span>
            <span
              class="icon fa fa-trash"
              title="移除"
              @click="deleteLayer(index)"
            ></span>
          </div>
        </div>
      </template>
    </div>
  </MyMapPlacement>
</template>

<script>
import MyMapPlacement from "./Placement";

export default {
  name: "MyMapLayerManage",
  inject: ["myMap"],
  components: { MyMapPlacement },
  data() {
    return {
      layers: []
    };
  },
  computed:{
    localLayers(){
      return this.layers.filter(x => !x.notInLayer);
    },
  },
  methods: {
    init() {
      let map = this.myMap.map;
      if (map) {
        this.layers = map.getLayers().getArray();
      }
    },
    changeVisible(index) {
      let layer = this.layers[index];
      layer.setVisible(!layer.getVisible());
    },
    upLayer(index) {
      this.myMap.map.swapLayerByIndex(index, index - 1); // 图层向下移动
    },
    downLayer(index) {
      this.myMap.map.swapLayerByIndex(index, index + 1); // 图层向上移动
    },
    deleteLayer(index) {
      let layer = this.layers[index];
      this.myMap.map.removeLayer(layer);
    }
  },
  mounted() {
    this.myMap.mapReady(this.init);
  }
};
</script>

<style lang="less">
@import "../../style/layerManage.less";
</style>
