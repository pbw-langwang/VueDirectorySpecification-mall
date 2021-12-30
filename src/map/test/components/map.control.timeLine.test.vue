<template>
  <div>
    <my-map style="width:1500px;height:800px">
      <MyMapTimeLine
        :dates="dates"
        :data="data"
        :vertical="vertical"
      ></MyMapTimeLine>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapTimeLine from "@map/components/my-map-control/TimeLine";

export default {
  components: {
    MyMap,
    MyMapTimeLine
  },
  data() {
    return {
      vertical: false,
      dates: [
        "2012",
        "2013",
        "2014",
        "2015",
        "2016",
        "2017",
        "2018",
        "2019",
        "2020",
        "2021"
      ],
      data: [
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/PM2_5/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/tdly2020/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/PM2_5/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/tdly2020/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/PM2_5/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/tdly2020/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/PM2_5/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/tdly2020/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/PM2_5/MapServer"
        },
        {
          type: "arcgis",
          url:
            "http://192.168.99.56:6080/arcgis/rest/services/SNJ/tdly2020/MapServer"
        }
      ]
    };
  }
};
</script>
