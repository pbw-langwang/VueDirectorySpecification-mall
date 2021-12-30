<template>
  <div>
    <my-map style="width: 1500px; height: 800px">
      <MyMapVectorJson
        ref="geo"
        :dataSource="dataSource"
        :styles="styles"
        :hoverStyles="hoverStyles"
        :isVectorImage="true"
        @click="handleClick"
      >
      </MyMapVectorJson>
      <MyMapPopup ref="popup">
        <div style="width: 200px; background: #fff">hello world</div>
      </MyMapPopup>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapPopup from "@map/components/my-map-overlay/Popup";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapPopup,
  },
  data() {
    return {
      dataSource: null,
      styles: {
        icon: {
          color: "rgba(255, 0, 0, .5)",
          crossOrigin: "anonymous",
          src: "data/bigdot.png",
          scale: 0.2,
        },
        fill: { color: "rgba(255,0,0,0.8)" },
      },
      hoverStyles: {
        circle: {
          fill: { color: "#fff" },
          stroke: {
            width: 2,
            color: "#000",
          },
          radius: 20,
        },
        fill: { color: "rgba(255,255,0,0.8)" },
        stroke: {
          width: 5,
          color: "#000",
        },
      },
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      const count = 40000;
      const list = new Array(count);
      for (let i = 0; i < count; ++i) {
        let x = parseInt(Math.random() * 360 - 180);
        let y = parseInt(Math.random() * 180 - 90);
        list.push({
          geometryType: "Point",
          coordinates: [x, y],
          prop0: "value0",
        });
      }
      this.dataSource = {
        type: "1", // List
        data: list,
        geometryKey: "geometryType",
      };
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
    },
  },
};
</script>
