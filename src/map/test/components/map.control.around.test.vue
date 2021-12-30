<template>
  <div>
    <my-map ref="mapCom" style="width: 1500px; height: 800px">
      <MyMapVectorJson ref="geo"> </MyMapVectorJson>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import { createCircle } from "@map/js/circle";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
  },
  data() {
    return {
      center: [110.5, 31.58],
      radius: 1000,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let map = this.$refs.mapCom.map;
      let feature = createCircle(map, this.center, this.radius);
      this.$refs.geo.source.addFeature(feature);
    },
  },
};
</script>