<template>
  <div>
    <my-map style="width:1500px;height:800px">
      <my-map-basemap></my-map-basemap>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapBasemap from "@map/components/my-map-control/Basemap";

export default {
  components: {
    MyMap,
    MyMapBasemap
  }
};
</script>
