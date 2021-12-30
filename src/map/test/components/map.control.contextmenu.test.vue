<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapContextmenu @callback="setCoordinate">
        <div class="contextmenu-container">
          <el-button type="" @click="setStart">起点</el-button>
          <el-button type="" @click="setEnd">终点</el-button>
        </div>
      </MyMapContextmenu>
    </my-map>
    <div>右键坐标：{{ coordinate ? JSON.stringify(coordinate) : null }}</div>
    <div>
      起点坐标：{{ startCoordinate ? JSON.stringify(startCoordinate) : null }}
    </div>
    <div>
      终点坐标：{{ endCoordinate ? JSON.stringify(endCoordinate) : null }}
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapContextmenu from "@map/components/my-map-control/Contextmenu";

export default {
  components: {
    MyMap,
    MyMapContextmenu
  },
  data() {
    return {
      coordinate: null,
      startCoordinate: null,
      endCoordinate: null
    };
  },
  methods: {
    setCoordinate(coordinate) {
      console.log(coordinate);
      this.coordinate = coordinate;
    },
    setStart() {
      this.startCoordinate = this.coordinate;
    },
    setEnd() {
      this.endCoordinate = this.coordinate;
    }
  }
};
</script>

<style lang="less" scoped>
.contextmenu-container {
  background: #fff;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.29);
  -moz-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.29);
  -webkit-box-shadow: 0 1px 10px rgba(0, 0, 0, 0.29);
  padding: 10px;
}
</style>
