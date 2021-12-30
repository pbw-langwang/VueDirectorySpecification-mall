<template>
  <div>
    <my-map style="width: 1500px; height: 800px">
      <MyMapVectorJson
        ref="geo"
        :dataSource="dataSource"
        :styles="styles"
        :hoverStyles="hoverStyles"
        :minZoom="10"
        @click="handleClick"
      >
      </MyMapVectorJson>
      <MyMapPopup ref="popup">
        <div style="width: 200px; background: #fff">hello world</div>
      </MyMapPopup>
    </my-map>
    <div>
      <button @click="updateDate">更新数据</button>
      <button @click="addData">加载数据</button>
      <button @click="addData1">加载url数据</button>
      <button @click="changeStyles">修改样式1</button>
      <button @click="changeStyles1">动态修改样式</button>
      <button @click="setHoverStyle">设置经过样式</button>
      <button @click="setFeature">手动设置样式</button>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import { geoList, jsonFeatureCollection, jsonFeature } from "../data/geo";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapPopup
  },
  data() {
    return {
      dataSource: {
        type: "4",
        data: "data/geojson.geojson"
      },
      styles: {
        icon: {
          color: "rgba(255, 0, 0, .5)",
          crossOrigin: "anonymous",
          src: "data/bigdot.png",
          scale: 0.2
        },
        fill: { color: "rgba(255,0,0,0.8)" }
      },
      hoverStyles: {
        circle: {
          fill: { color: "#fff" },
          stroke: {
            width: 2,
            color: "#000"
          },
          radius: 20
        },
        fill: { color: "rgba(255,255,0,0.8)" },
        stroke: {
          width: 5,
          color: "#000"
        }
      }
    };
  },
  methods: {
    updateDate() {
      this.dataSource = {
        type: "1", // List
        data: geoList,
        geometryKey: "geometryType"
      };
    },
    addData() {
      // 清除原有数据
      this.$refs.geo.clear();

      let params = [
        {
          type: "3", // FeatureCollection
          data: jsonFeatureCollection
        },
        {
          type: "2", // Feature
          data: jsonFeature
        },
        {
          type: "1", // List
          data: geoList,
          geometryKey: "geometryType"
        }
      ];
      params.forEach(x => {
        this.$refs.geo.addData(x);
      });
    },
    addData1() {
      let urlData = {
        type: "4",
        data: "data/geojson.geojson"
      };
      this.$refs.geo.addData(urlData);
    },
    // 固定样式，多个样式叠加
    changeStyles() {
      let styles = [
        {
          circle: {
            fill: { color: "rgba(255,0,0,0.8)" },
            stroke: {
              width: 1,
              color: "#000"
            },
            radius: 5
          }
        },
        {
          fill: { color: "rgba(255,0,0,0.8)" },
          stroke: {
            width: 5,
            color: "#000"
          }
        }
      ];
      this.$refs.geo.setStyles(styles);
    },
    // 动态设置样式
    changeStyles1() {
      let fn = (feature, resolution) => {
        console.log(feature);
        let name = feature.get("prop0").toString();
        return {
          text: {
            text: name
          },
          circle: {
            fill: { color: "rgba(255,0,0,0.8)" },
            stroke: {
              width: 1,
              color: "#000"
            },
            radius: name.length + 5 || 5
          }
        };
      };
      this.$refs.geo.setStyles(fn);
    },
    setFeature() {
      let features = this.$refs.geo.source.getFeatures();
      let style = {
        circle: {
          fill: { color: "rgba(0,255,0,0.8)" },
          stroke: {
            width: 1,
            color: "#000"
          },
          radius: 10
        },
        fill: { color: "rgba(0,255,0,0.8)" },
        stroke: {
          width: 1,
          color: "#000"
        }
      };
      this.$refs.geo.setFeatureStyle(features[0], style);
    },
    // 设置经过样式
    setHoverStyle() {
      this.$refs.geo.setHoverStyles(this.hoverStyles);
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
