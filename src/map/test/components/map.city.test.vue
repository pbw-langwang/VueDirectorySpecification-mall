<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapCity></MyMapCity>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapCity from "@map/components/my-map-control/City";

export default {
  components: {
    MyMap,
    MyMapCity
  }
};
</script>
