<template>
  <div style="width:1500px;">
    <my-map ref="mapCom" style="width:1500px;height:800px">
      <MyMapVectorJson ref="geo" :zindex="999999"></MyMapVectorJson>
    </my-map>
    <div class="query-result-container">
      <div class="query-layers">
        <el-tree
          ref="tree"
          :data="layers"
          :props="{ label: 'name' }"
          node-key="id"
          :current-node-key="layerId"
          :indent="4"
          :highlight-current="true"
          :default-expand-all="true"
          @node-click="nodeClickEvent"
        >
        </el-tree>
      </div>
      <div class="query-property">
        <PropertyTable
          :alias="tableData ? tableData.alias : {}"
          :list="tableData ? tableData.list : []"
          :sum="total"
          :pageSize="pageSize"
          ref="table"
          @row-click="rowClickEvent"
          @change="pageChangeEvent"
        ></PropertyTable>
      </div>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import { getLayerInfo, propertiesQuery } from "@map/js/query/query";
import { createTreeByArray } from "@map/js/utils/array";

import PropertyTable from "./com/property.vue";

export default {
  components: {
    MyMap,
    MyMapVectorJson,
    PropertyTable
  },
  data() {
    return {
      data: {
        type: "hgt",
        id: "1",
        layerId: "09a3bec5-b9f5-4a93-b47f-7f5a4e1a4992",
        name: "图层",
        dataType: "DLGDataNode",
        prefixUrl: "http://192.168.99.231:9527"
      },
      layers: [],
      layerId: null,
      projection: null,
      tableData: null,
      pageSize: 10,
      pageIndex: 1,
      total: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let params = {
        type: "hgt",
        url: `${this.data.prefixUrl}/DataShareService/GetMapOutImg`,
        id: "1",
        projection: "EPSG:4326",
        restOption: {
          layerid: this.data.layerId,
          dataType: this.data.dataType
        }
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      this.info = await getLayerInfo({
        type: this.data.type,
        layerId: this.data.layerId,
        name: this.data.name
      });

      if (this.info) {
        let layers = this.info.layers;
        this.layers = createTreeByArray(layers, {
          idKey: "id",
          pidKey: "parentLayerId"
        });
        this.projection = this.info.projection;

        // 找到第一个叶子节点
        let item = this.layers.find(x => {
          return !x.subLayerIds;
        });
        if (item) {
          this.$nextTick(() => {
            let tree = this.$refs.tree;
            tree.setCurrentKey(item.id);
            this.nodeClickEvent(item);
          });
        }
      }
    },
    nodeClickEvent(data) {
      if (!data) {
        return;
      }
      this.layerId = data.id;
      this.getTableData();
    },
    pageChangeEvent({ pageIndex, pageSize }) {
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.getTableData();
    },
    async getTableData() {
      this.tableData = null;

      let view = this.$refs.mapCom.map.getView();
      let projection = view.getProjection();
      let result = await propertiesQuery({
        layer: this.data,
        layerId: this.layerId,
        layerProjection: this.projection,
        params: { pageIndex: this.pageIndex, pageSize: this.pageSize },
        featureProjection: projection
      });
      if (result) {
        this.tableData = result;
        this.total = result.sum;
      }
    },
    rowClickEvent(row) {
      if (row) {
        let geometry = row.feature.getGeometry();
        this.$refs.mapCom.map.getView().fit(geometry);
        this.$refs.geo.source.addFeatures([row.feature]);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.query-result-container {
  display: flex;
  border: 1px solid #000;
  box-sizing: border-box;
  max-height: 300px;
  width: 100%;
  .query-layers {
    width: 300px;
    max-height: 100%;
    padding: 10px;
    border-right: 1px solid #000;
    overflow: auto;
    .query-layers-item {
      &.active {
        background-color: #d9ecff;
      }
    }
  }
  .query-property {
    flex: 1;
    max-height: 100%;
    overflow: auto;
  }
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
