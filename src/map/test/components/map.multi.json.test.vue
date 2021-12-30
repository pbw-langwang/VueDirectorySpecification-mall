<template>
  <div>
    <my-map ref="mapCom" style="width: 1500px; height: 800px">
      <div v-for="(item, name, index) in dataArray" :key="index">
        <MyMapVectorJson
          :ref="item.id"
          :id="item.id"
          :name="item.name"
          :dataSource="item.dataSource"
          :styles="item.styles"
          :isFit="true"
          :hoverStyles="item.hoverStyles"
          @click="handleClick"
        >
        </MyMapVectorJson>
      </div>

      <MyMapPopup ref="popup">
        <div style="width: 200px; background: #fff">hello world</div>
      </MyMapPopup>
    </my-map>
    <div>
      <button @click="addData1">加载数据1</button>
      <button @click="addData2">加载数据2</button>
      <button @click="visibleData1">数据1可见/不可见</button>
      <button @click="removeData('1')">移除数据1</button>
      <button @click="removeData('2')">移除数据2</button>
      <button @click="upMove">上移数据2</button>
      <button @click="downMove">下移数据2</button>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import { itemUp, itemDown } from "@map/js/utils/array";
import { geoList, jsonFeatureCollection, jsonFeature } from "../data/geo";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapPopup
  },
  data() {
    return {
      dataArray: {}
    };
  },
  methods: {
    addData1() {
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
      this.$set(this.dataArray, item.id, item);
    },
    addData2() {
      let item = {
        id: "2",
        name: "图层2",
        dataSource: {
          type: "3", // FeatureCollection
          data: jsonFeatureCollection
        }
      };
      this.$set(this.dataArray, item.id, item);
    },
    removeData(id) {
      // 指定图层删除
      if (this.dataArray && this.dataArray[id]) {
        this.$delete(this.dataArray, id);
      }
    },
    visibleData1() {
      let id = "1";
      let layer = this.$refs[id][0].layer;
      layer.setVisible(!layer.getVisible());
    },
    upMove() {
      // 图层
      this.$refs.mapCom.upLayerByKey("id", "2");
    },
    downMove() {
      // 图层
      this.$refs.mapCom.downLayerByKey("id", "2");
    },
    // 点击要素
    handleClick(e, feature) {
      if (feature) {
        console.log(feature);
        // 要素属性
        console.log(feature.getProperties());
        // 要素输出坐标
        console.log(feature.outGeometry.getCoordinates());

        this.$refs.popup.show(e.coordinate);
      }
    }
  }
};
</script>
