# 查询服务

# 属性查询

获取湖北省行政区划
```vue
<template>
  <div>
    <my-map ref="mapCom" @ready="init">
      <MyMapVectorJson ref="geo"></MyMapVectorJson>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import { getLayerInfo, propertiesQuery } from "@map/js/query/query";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
  },
 methods: {
    async init() {
      let layerParam = {
        type: "arcgis",
        url:
          "/arcgis/rest/services/nongjiProject/boundary/MapServer",
      };

      let layerIndex = 0; // 省

      // 获取地图的坐标系
      let projection = this.$refs.mapCom.map.getView().getProjection();

      let info = await getLayerInfo(layerParam);
      if (info) {
        let res = await propertiesQuery({
          layer: layerParam,
          layerId: layerIndex,
          layerProjection: info.projection,
          params: { where:[{key:"adcode", operator: "like", value: "'42%'"}] },
          featureProjection: projection
        });

        if (res) {
          this.$refs.geo.source.addFeatures(res.features);
        }
      }
    },
  }
}
</script>
```
