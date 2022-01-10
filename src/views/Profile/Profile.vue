<template>
  <div class="my-map">
    <div class="map-container">
      <!-- nullselect表示未捕获要素的事件 -->
      <my-map ref="mapCom" @nullselect="clearSelectFeature">
        <MyMapVectorJson
          ref="province"
          :styles="provinceStyles"
        ></MyMapVectorJson>

        <MyMapVectorJson 
          :dataSource="dataSource"
          @click="handleClick"
          :styles="styles"
          :hoverStyles="hoverStyles"
        ></MyMapVectorJson>

        <MyMapPopup 
          ref="popup"
        >
          <!-- 弹出框的具体显示内容 -->
          <div class="showPopup" v-if="info">
            <p>经度:{{info.coordinates[0]}}</p>
            <p>纬度:{{info.coordinates[1]}}</p>
          </div>
        </MyMapPopup>
      </my-map>
    </div>
  </div>
</template>

<script>
  import MyMap from "@map/components/my-map/Map";
  import MyMapVectorJson from "@map/components/my-map-vector/Json";
  import MyMapPopup from "@map/components/my-map-overlay/Popup";

  import * as mapHandler from "./js/mapHandler";

  // import {Feature} from "ol";
  // import axios from "axios";

  export default {
    data(){
      return {
        dataSource:null,
        selectFeature: null,
        styles:mapHandler.pointStyles,
        hoverStyles:mapHandler.pointHoverStyles,
        provinceStyles: {
          stroke: {
            color: "rgba(55, 232, 205, 1)",
            width: 3,
          },
          fill: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
      }
    },
    components:{
      MyMap,
      MyMapVectorJson,
      MyMapPopup,
    },
    watch:{
      selectFeature: function (newVal, oldVal) {
        //获取到弹出层，弹出层封装了setFeatureStyle
        // console.log("selectFeature:",oldVal)
        // console.log("selectFeature:",oldVal._layer)
        // console.log("selectFeature:",oldVal._layer._vm)

        // 样式还原
        if (oldVal) {
          let vm = oldVal._layer._vm
          vm.setFeatureStyle(oldVal, vm.styles)
        }

        // 设置选中样式
        if (newVal) {
          let vm = newVal._layer._vm
          vm.setFeatureStyle(newVal, vm.hoverStyles)
        }
      },
    },
    computed: {
      info() {
        // 获取详情
        if (this.selectFeature) {
          console.log("info",this.selectFeature.getProperties());
          return this.selectFeature.getProperties();
        }
        return null;
      }
    },
    created(){
      // this.initProvince();
    },
    mounted(){
      this.initMap();
    },
    methods:{
      // bug:画边界无效[可能是数据模拟不对]
      // initProvince(){
      //   axios.get('/json/hubei.json').then(res=>{
      //     // console.log(res.data)
      //     let a = res.data.map(v => {
      //       v = new Feature(v)
      //       return v;
      //     });
      //     console.log(a);
      //     this.$refs.province.source.addFeatures(a);
      //   }).catch(err=>{
      //     console.log(err);
      //   })
      // },

      initMap(){
        // 显示蒙层的位置
        this.dataSource = {
          type: "1",
          data: [
            {
              geometryType: "Point",
              coordinates: [111.6, 31.6]
            },
            {
              geometryType: "Point",
              coordinates: [110.6, 31.6]
            },
            {
              geometryType: "Point",
              coordinates: [112.6, 31.6]
            },
            {
              geometryType: "Point",
              coordinates: [111.3, 31.6]
            }
          ],
          geometryKey: "geometryType"
        };
      },

      handleClick(e, feature) {
        console.log("handleClick:",e,feature)
        if (feature) {
          this.selectFeature = feature;
          console.log("getProperties:",feature.getProperties());
          this.$refs.popup.show(e.coordinate);
          // 这种会设置全部样式
          // this.styles = mapHandler.pointHoverStyles;
        }
      },

      clearSelectFeature() {
        this.selectFeature = null;
        // this.styles = mapHandler.pointStyles;
      }
    }
  }
</script>

<style>
.my-map {
  height: 100vh;
}
.map-container{
  height: calc(100% - 49px);
}
.showPopup{
  width: 100px;
  height: 100px;
  background-color: red;
  color: white;
  font-size: 15px;
}
</style>