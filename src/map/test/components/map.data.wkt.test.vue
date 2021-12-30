<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapVectorJson
        :dataSource="data.dataSource"
        :dataType="data.dataType"
      ></MyMapVectorJson>
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
      data: {
        dataSource: {
          type: "1",
          data: [
            {
              id: "1",
              geometry: "POINT(110.61260986 31.60690428)"
            },
            {
              id: "2",
              geometry:
                "LINESTRING(110.61260986 31.60690428, 111.14064026 31.51738827)"
            },
            {
              id: "3",
              geometry: "POINT(111.14064026 31.51738827)"
            },
          ],
          geometryKey: "geometry"
        },
        dataType: "wkt"
      }
    };
  }
};
</script>
