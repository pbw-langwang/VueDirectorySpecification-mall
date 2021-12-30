<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapFrame v-if="visible" cityCode="429021" scale="H"></MyMapFrame>
    </my-map>
    <el-button @click="showVisible">图幅</el-button>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapFrame from "@map/components/my-map-control/Frame";

export default {
  components: {
    MyMap,
    MyMapFrame
  },
  data() {
    return {
      visible: false
    };
  },
  methods: {
    showVisible() {
      this.visible = !this.visible;
    }
  }
};
</script>
