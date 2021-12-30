<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px" @ready="init">
      <MyMapVectorJson ref="geo"> </MyMapVectorJson>
    </my-map>
    <div>
      <button @click="pointBuffer">点缓存</button>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import { getBufferFeatureByFeature } from "@map/js/analysis/buffer";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

export default {
  components: {
    MyMap,
    MyMapVectorJson
  },
  methods: {
    init(map){
      map.addScaleLine();
    },
    pointBuffer() {
      let geometry = new Point([110.5, 31.58]);
      let point = new Feature({
        geometry: geometry.transform(
          "EPSG:4326",
          this.$refs.mapCom.map.projection
        )
      });
      let feature = getBufferFeatureByFeature({
        feature: point,
        radius: 10,
        unit: "kilometers",
        inputProjection: this.$refs.mapCom.map.projection,
        outputProjection: this.$refs.mapCom.map.projection
      });
      if (feature) {
        this.$refs.geo.source.addFeatures([point, feature]);
      }
    }
  }
};
</script>
