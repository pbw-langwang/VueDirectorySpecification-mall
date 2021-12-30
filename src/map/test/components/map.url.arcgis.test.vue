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
    this.addArcGISTIle();
    this.addArcGISImage();
  },
  methods: {
    async addArcGISImage() {
      let params = {
        type: "arcgis",
        url:
          "http://192.168.99.56:6080/arcgis/rest/services/SNJ/river/MapServer",
        projection: "EPSG:3857",
        layers: "0", // 多图层，","隔开，如"0,1"
        // crossOrigin:false, // 截图时启用
        imageOptions: { prop1: "1" }, // ol/layer/tile其他参数
        restOption: null, // ArcGIS Rest parameters Service其他参数，用于扩展,
        id: "1" // 用于查找图层
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      let layers = this.$refs.mapCom.map.getLayerByKey("id", "1");
      console.log(layers);
    },
    async addArcGISTIle() {
      let params = {
        type: "arcgis",
        url:
          "http://192.168.99.56:6080/arcgis/rest/services/SNJ/sat_and_ano_map/MapServer",
        projection: "EPSG:3857",
        tileGrid: null, // 参考 ol/tilegrid/WMTS
        // crossOrigin: true, // 截图时启用
        wrapX: false,
        tileOptions: { prop1: "1" }, // ol/layer/tile其他参数
        xyzOptions: null, // ol/source/xyz其他参数，用于扩展,
        id: "2" // 用于查找图层
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      let layers = this.$refs.mapCom.map.getLayerByKey("id", "2");
      console.log(layers);
    }
  }
};
</script>
