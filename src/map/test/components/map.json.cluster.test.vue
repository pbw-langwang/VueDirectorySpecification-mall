<template>
  <div>
    <my-map style="width: 1500px; height: 800px">
      <MyMapVectorCluster
        ref="geo"
        :dataSource="dataSource"
        :isCluster="true"
        :styles="styles"
        :hoverStyles="hoverStyles"
        :clusterStyles="styleFunction"
        @click="handleClick"
      >
      </MyMapVectorCluster>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorCluster from "@map/components/my-map-vector/Cluster";
import { geoListCluster } from "../data/geo";

let styleCache = {};

let style = {
  circle: {
    radius: 20,
    stroke: {
      color: "#3399CC"
    },
    fill: {
      color: "#3399CC"
    }
  }
};

let hoverStyle = {
  circle: {
    radius: 20,
    stroke: {
      color: "#ff0f00"
    },
    fill: {
      color: "#ff0f00"
    }
  }
};

export default {
  components: {
    MyMap,
    MyMapVectorCluster
  },
  data() {
    return {
      dataSource: {
        type: "1", // List
        data: geoListCluster,
        geometryKey: "geometryType"
      },
      styles: style, // this.styleFunction
      hoverStyles: hoverStyle
    };
  },
  methods: {
    // 点击要素
    handleClick(e, feature) {
      if (feature) {
        console.log(feature);
        // 要素属性
        console.log(feature.getProperties());
        // 要素输出坐标
        console.log(feature.outGeometry.getCoordinates());
      }
    },
    styleFunction(feature, resolution) {
      var size = feature.get("features").length;
      var style = styleCache[size];
      if (!style) {
        style = {
          circle: {
            radius: 10,
            stroke: {
              color: "#ff0"
            },
            fill: {
              color: "#ff0"
            }
          },
          text: {
            text: size.toString(),
            fill: {
              color: "#000"
            }
          }
        };
        styleCache[size] = style;
      }
      return style;
    }
  }
};
</script>
