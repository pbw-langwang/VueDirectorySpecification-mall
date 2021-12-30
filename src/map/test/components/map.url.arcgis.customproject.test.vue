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
    this.addArcGISImage();
  },
  methods: {
    async addArcGISImage() {
      let params = {
        type: "arcgis",
        url:
          "http://192.168.99.56:6080/arcgis/rest/services/SNJ/动物分布点/MapServer",
        id: "1" // 用于查找图层
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      let layers = this.$refs.mapCom.map.getLayerByKey("id", "1");
      console.log(layers);
    },
  }
};
</script>
