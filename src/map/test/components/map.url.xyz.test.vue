<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px"></my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";

export default {
  components: {
    MyMap
  },
  mounted() {
    this.addXYZ();
  },
  methods: {
    async addXYZ() {
      let params = {
        type: "xyz",
        url:
          "http://t{0-7}.tianditu.com/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
        projection: "EPSG:3857",
        tileGrid:null, // 参考 ol/tilegrid/WMTS
        crossOrigin:true, // 截图时启用
        wrapX:false,
        tileOptions:{"prop1":"1"}, // ol/layer/tile其他参数
        xyzOptions:null, // ol/source/xyz其他参数，用于扩展,
        id:"1", // 用于查找图层
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      let layers  = this.$refs.mapCom.map.getLayerByKey("id","1");
      console.log(layers);
    }
  }
};
</script>
