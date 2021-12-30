<template>
  <div>
    <my-map style="width: 1500px; height: 800px" ref="mapCom">
      <MyMapVectorJson ref="geo" :dataSource="dataSource"></MyMapVectorJson>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";

export default {
  components: {
    MyMap,
    MyMapVectorJson
  },
  data() {
    return {
      dataSource: null
    };
  },
  mounted() {
    // let start = new Date().getTime();
    // shp("data/gis_osm_transport_free_1").then((geojson)=> {
    //   let data = {
    //     type: "3", // List
    //     data: geojson
    //   };
    //   this.$refs.geo.addData(data);
    // });
    // this.$refs.mapCom.map.on("rendercomplete",() =>{
    //   let end = new Date().getTime();
    //   console.log(end-start);
    // })
  }
};
</script>
