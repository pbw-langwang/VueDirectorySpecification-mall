<template>
  <div>
    <my-map style="width:1500px;height:800px">
      <MyMapSwipe
        :first="first"
        :second="second"
        :vertical="vertical"
      ></MyMapSwipe>
    </my-map>
    <div>
      <button @click="changeLayer">修改图层数据</button>
      <button @click="changeDir">横向/竖向</button>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapSwipe from "../../components/my-map-control/Swipe.vue";

export default {
  components: {
    MyMap,
    MyMapSwipe
  },
  data() {
    return {
      first: {
        type: "xyz",
        url:
          "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
        projection: "EPSG:3857"
      },
      second: {
        type: "xyz",
        url:
          "http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
        projection: "EPSG:3857"
      },
      vertical: false
    };
  },
  methods: {
    changeLayer() {
      let first = { ...this.second };
      let second = { ...this.first };
      this.first = first;
      this.second = second;
    },
    changeDir() {
      this.vertical = !this.vertical;
    }
  }
};
</script>
