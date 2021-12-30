<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px"></my-map>
    <LegendCom :data="info"></LegendCom>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import LegendCom from "@map/components/base/Legend";
import { getLegend } from "@map/js/query/query";

export default {
  components: {
    MyMap,
    LegendCom
  },
  data() {
    return {
      info: null
    };
  },
  mounted() {
    this.addArcGISImage();
  },
  methods: {
    async addArcGISImage() {
      let params = {
        type: "arcgis",
        url:
          "http://192.168.99.56:6080/arcgis/rest/services/SNJ/river/MapServer",
        id: "1" // 用于查找图层
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      let result = await getLegend(params);
      this.info = result.layers;
    }
  }
};
</script>
