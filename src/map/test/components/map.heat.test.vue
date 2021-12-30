<template>
  <div>
    <my-map style="width: 1500px; height: 800px">
      <MyMapVectorHeat :dataSource="dataSource"></MyMapVectorHeat>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorHeat from "@map/components/my-map-vector/Heat";
import { geoList } from "../data/geo";

export default {
  components: {
    MyMap,
    MyMapVectorHeat
  },
  data() {
    return {
      dataSource: {
        type: "1",
        data: geoList,
        geometryKey: "geometryType"
      }
    };
  }
};
</script>
