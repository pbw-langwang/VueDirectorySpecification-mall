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
    this.addWMS();
  },
  methods: {
    async addWMS() {
      let params = {
        type: "wms",
        url:"http://192.168.250.208:5000/TFGTKJGH/WMS/GetMapOutImg",
        projection: "EPSG:4326",
        crossOrigin:true, // 截图时启用
        imageOptions: { prop1: "1" }, // ol/layer/tile其他参数
        restOption: { // 根据服务的参数自定义
          layerid:"4250c416-059d-4858-9693-ffabcb259c26", 
          vector: 1
        },
        id: "1" // 用于查找图层
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      let layers = this.$refs.mapCom.map.getLayerByKey("id", "1");
      console.log(layers);
    },
  }
};
</script>