<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapQuerySpatial ref="spatial"></MyMapQuerySpatial>
      <MyMapVectorJson ref="geo" :zindex="999999" @click="handleClick">
      </MyMapVectorJson>
      <MyMapPopup ref="popup">
        <div style="background:#fff">
          <div v-for="(value, name) in properties" :key="name">
            {{ name }}：{{ value }}
          </div>
        </div>
      </MyMapPopup>
    </my-map>
    <div>
      <el-cascader
        v-model="selectValue"
        :options="layers"
        :props="{ value: 'id', label: 'name' }"
        @change="handleChange"
      ></el-cascader>
      <el-button @click="selectEvent('Point')">点选</el-button>
      <el-button @click="selectEvent('Box')">框选</el-button>
      <el-button @click="selectEvent('Polygon')">多边形</el-button>
      <el-button @click="clear">清除</el-button>
    </div>
    <div>
      <el-table
        :data="list"
        stripe
        border
        size="small"
        height="100%"
        :highlight-current-row="true"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="rowClickEvent"
      >
        <el-table-column
          v-for="(item, index) in alias"
          :key="index"
          :prop="item"
          :label="item"
          :show-overflow-tooltip="true"
          sortable
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapQuerySpatial from "@map/components/query/geospatial";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import MyMapPopup from "@map/components/my-map-overlay/Popup";
import { getLayerInfo, spatialQuery } from "@map/js/query/query";
import { createTreeByArray } from "@map/js/utils/array";

export default {
  components: {
    MyMap,
    MyMapQuerySpatial,
    MyMapVectorJson,
    MyMapPopup
  },
  data() {
    return {
      data: {
        type: "arcgis",
        url: "http://192.168.99.56:6080/arcgis/rest/services/SNJ/xzqu/MapServer"
      },
      info: null,
      layers: [],
      selectValue: [],
      layerId: null,
      projection: null,
      list: [],
      alias: [],
      properties: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$refs.mapCom.map.addImageLayer(this.data);
      this.info = await getLayerInfo(this.data);
      if (this.info) {
        this.layers = createTreeByArray(this.info.layers);
        this.projection = this.info.projection;
      }
    },
    handleChange(value) {
      this.layerId = value[value.length - 1];
    },
    selectEvent(type) {
      if (this.layerId != null) {
        this.$refs.spatial.draw({
          type: type,
          callback: this.selectCallback
        });
      }
    },
    async selectCallback(feature, projection) {
      let res = await spatialQuery({
        layer: this.data,
        layerId: this.layerId,
        layerProjection: this.projection,
        feature: feature,
        featureProjection: projection
      });
      if (res) {
        this.$refs.geo.source.addFeatures(res.features);
        this.list = res.list;
        this.alias = res.alias;
      }
    },
    clear() {
      this.$refs.geo.source.clear();
      this.list = [];
    },
    handleClick(e, feature) {
      if (feature) {
        let properties = feature.getProperties();
        delete properties.geometry;
        this.properties = properties;
        this.$refs.popup.show(e.coordinate);
      }
    },
    rowClickEvent(row) {
      if (row) {
        let geometry = row.feature.getGeometry();
        this.$refs.mapCom.map.getView().fit(geometry);
      }
    }
  }
};
</script>
