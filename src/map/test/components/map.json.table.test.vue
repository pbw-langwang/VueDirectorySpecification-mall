<template>
  <div>
    <my-map
      ref="mapCom"
      style="width: 1500px; height: 800px"
      @nullselect="clear"
    >
      <MyMapVectorJson
        ref="geo"
        :dataSource="dataSource"
        :styles="styles"
        :hoverStyles="hoverStyles"
        @click="handleClick"
      >
      </MyMapVectorJson>
      <MyMapPopup ref="popup">
        <div style="width: 200px; background: #fff">
          {{ info ? info.id : "" }}
        </div>
      </MyMapPopup>
    </my-map>
    <div v-for="(item, index) in dataSource.data" :key="index" class="table">
      <span>{{ item.id }}</span>
      <span>{{ item.prop0 }}</span>
      <span><button @click="view(item)">查看</button></span>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import { getCenterByFeature } from "@map/js/feature";
import { geoList } from "../data/geo";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    MyMapPopup
  },
  data() {
    return {
      dataSource: {
        type: "1", // List
        data: geoList,
        geometryKey: "geometryType"
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
      },
      selectFeature: null,
      selectStyle: {
        circle: {
          fill: { color: "#ff0" },
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
  computed: {
    info() {
      // 获取详情
      if (this.selectFeature) {
        return this.selectFeature.getProperties();
      }
      return null;
    }
  },
  watch: {
    selectFeature: function(newVal, oldVal) {
      // 样式还原
      if (oldVal){
        let vm = oldVal._layer._vm;
        vm.setFeatureStyle(oldVal, vm.styles);
      }

      // 设置选中样式
      if (newVal){
        let vm = newVal._layer._vm;
        vm.setFeatureStyle(newVal, vm.hoverStyles);
      }
    }
  },
  methods: {
    handleClick(e, feature) {
      // 要素点击事件
      if (feature) {
        this.selectFeature = feature;
        this.$refs.popup.show(e.coordinate);
      }
    },
    view(item) {
      // 通过map 坐标查询(带属性)
      let map  = this.$refs.mapCom.map;
      let coordinates =  map.inputCoordinate(item.coordinates);
      let feature = map.getFeatureByCoordinate(coordinates,"id", item.id);
      if (feature){
        this.selectFeature = feature;
        let coordinate = getCenterByFeature(this.selectFeature);
        if (coordinate) {
          // 弹窗
          this.$refs.popup.show(coordinate);
          // 视图居中
          this.$refs.mapCom.map.getView().setCenter(coordinate);
        }
      }
      // 通过属性查看
      // let items = this.$refs.geo.getItems("id", item.id);
      // if (items) {
      //   this.selectFeature = items[0];
      //   let coordinate = getCenterByFeature(this.selectFeature);
      //   if (coordinate) {
      //     // 弹窗
      //     this.$refs.popup.show(coordinate);
      //     // 视图居中
      //     this.$refs.mapCom.map.getView().setCenter(coordinate);
      //   }
      // }
    },
    clear() {
      // 清除
      this.selectFeature = null;
    }
  }
};
</script>

<style>
.table {
  display: flex;
}

.table span {
  padding: 2px 5px;
  border: 1px solid #000;
}
</style>
