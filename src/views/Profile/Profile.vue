<template>
  <div>
    <div class="map-container">
      <my-map ref="mapCom" style="width:1500px;height:800px"  @nullselect="clearSelectFeature">
        <MyMapVectorJson :dataSource="dataSource" @click="handleClick"></MyMapVectorJson>
        <MyMapPopup ref="popup">
          <!-- 弹出框的具体显示内容 -->
          <div class="showPopup" v-if="info">{{ info.geometryType }}</div>
        </MyMapPopup>
      </my-map>
    </div>
  </div>
</template>

<script>
  import MyMap from "@map/components/my-map/Map";
  import MyMapVectorJson from "@map/components/my-map-vector/Json";
  import MyMapPopup from "@map/components/my-map-overlay/Popup";

  export default {
    data(){
      return {
        dataSource:null,
        selectFeature: null,
      }
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
    components:{
      MyMap,
      MyMapVectorJson,
      MyMapPopup,
    },
    mounted(){
      this.initMap();
    },
    methods:{
      async initMap(){
        let params = {
          type: "arcgis",
          url: "http://192.168.99.56:6080/arcgis/rest/services/SNJ/river/MapServer"
        };
        let map = this.$refs.mapCom.map;
        await map.addImageLayer(params);
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
        }
      },

      clearSelectFeature() {
        this.selectFeature = null;
      }
    }
  }
</script>

<style>
.map-container {
  width: 1500px;
  height: 800px;
}
.showPopup{
  width: 100px;
  height: 100px;
  background-color: red;
  color: white;
  font-size: 15px;
}
</style>