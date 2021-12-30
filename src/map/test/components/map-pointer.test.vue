<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapPointer></MyMapPointer>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapPointer from "@map/components/my-map-control/Pointer";

export default {
  components: {
    MyMap,
    MyMapPointer
  }
};
</script>
