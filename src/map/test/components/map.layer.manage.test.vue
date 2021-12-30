<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapLayerManage></MyMapLayerManage>
      <div v-for="(item, index) in dataSources" :key="index">
        <MyMapVectorJson :name="item.name" :dataSource="item.dataSource">
        </MyMapVectorJson>
      </div>
    </my-map>
    <div>
      <button @click="addData">加载数据</button>
      <button @click="addData1">加载数据1</button>
      <button @click="addData2">加载数据2</button>
       <button @click="swapEvent">图层1移动到图层3之后</button>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapLayerManage from "@map/components/my-map-control/LayerManage";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import { geoList, jsonFeatureCollection, jsonFeature } from "../data/geo";

export default {
  components: {
    MyMap,
    MyMapLayerManage,
    MyMapVectorJson
  },
  data() {
    return {
      dataSources: []
    };
  },
  methods: {
    addData() {
      let item = {
        id: "1",
        name: "图层1",
        dataSource: {
          type: "1", // List
          data: geoList,
          geometryKey: "geometryType"
        },
        styles: null,
        hoverStyles: null
      };
      this.dataSources.push(item);
    },
    addData1() {
      let item = {
        id: "2",
        name: "图层2",
        dataSource: {
          type: "3", // FeatureCollection
          data: jsonFeatureCollection
        }
      };
      this.dataSources.push(item);
    },
    addData2() {
      let item = {
        id: "3",
        name: "图层3",
        dataSource: {
          type: "2", // FeatureCollection
          data: jsonFeature
        }
      };
      this.dataSources.push(item);
    },
    swapEvent(){
      this.$refs.mapCom.map.swapLayerByIndex(1, 3);
    }
  }
};
</script>
