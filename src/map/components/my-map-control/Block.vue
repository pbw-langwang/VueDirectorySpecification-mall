<template>
  <div>
    <MyMapVectorJSON :styles="regionStyle" ref="region"></MyMapVectorJSON>
    <MyMapVectorJSON :styles="data.styles" ref="block"></MyMapVectorJSON>
  </div>
</template>

<script>
import MyMapVectorJSON from "./../my-map-vector/Json";
import { propertiesQuery } from "../../js/query/query";
import { cities_mapServer } from "../../config";
import Worker from "../../js/framing/block.worker.js";
import Feature from "ol/Feature";
import { fromExtent } from "ol/geom/Polygon";

const styles = [
  {
    stroke: {
      color: "#8B0000",
      width: 1,
    },
    fill: {
      color: "transparent",
    },
  },
];

const hoverStyles = [
  {
    stroke: {
      color: "#8B0000",
      width: 1,
    },
    fill: {
      color: "rgba(139,0,0,0.4)",
    },
  },
];

const regionStyle = [
  {
    stroke: {
      color: "#00BFFF",
      width: 2,
    },
    fill: {
      color: "rgba(139,0,0,0)",
    },
  },
];

export default {
  inject: ["myMap"],
  provide: function () {
    return {
      myMap: this.myMap,
    };
  },
  components: {
    MyMapVectorJSON,
  },
  props: {
    cityCode: {
      type: String,
      default: null,
    },
    length: {
      type: Number,
      default: 2000,
    },
    styles: {
      type: [Object, Array, Function],
      default: () => {
        return null;
      },
    },
  },
  data() {
    return {
      regionStyle: regionStyle,
      data: {
        styles: this.styles || styles,
        hoverStyles: hoverStyles,
      },
      params: {
        extent: null,
        polygon: null,
      },
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    cityCode: function () {
      this.params.extent = null;
      this.params.polygon = null;
      this.init();
    },
    length: function () {
      this.init();
    },
  },
  methods: {
    async init() {
      this.$refs.region.source.clear();
      this.$refs.block.source.clear();
      this.showLayer(false);
      if (!this.cityCode) {
        return;
      }
      if (!this.params.extent || !this.params.polygon) {
        let result = await this.getRegionPolygon();
        if (result) {
          this.params.extent = result.extent;
          this.params.polygon = result.polygon;
        }
      }
      let params = { ...this.params, length: this.length };
      // let result = getBlocks(params);
      let worker = new Worker();
      worker.postMessage(params);
      worker.addEventListener("message", (e) => {
        let result = e.data;
        this.showBlockOnMap(result);
        worker.terminate();
      });
    },
    getBlockLayer() {
      return this.$refs.block.layer;
    },
    showLayer(boolean = true) {
      this.$refs.region.layer.setVisible(boolean);
      this.$refs.block.layer.setVisible(boolean);
    },
    showBlockOnMap(block) {
      let features = block.map((x) => {
        let feature = new Feature({
          geometry: fromExtent(x.extent),
          ...x,
        });
        return feature;
      });

      this.$refs.block.source.addFeatures(features);
      this.$emit("ready", features);
    },
    async getRegionPolygon() {
      let config = window.cities_mapServer || cities_mapServer;
      let params = {
        layer: {
          type: "arcgis",
          url: config.url,
        },
        layerId: config.id,
        layerProjection: config.projection,
        featureProjection: "EPSG:3857",
        params: {
          where: [
            {
              key: config.codeKey,
              operator: "=",
              value: this.cityCode,
            },
          ],
        },
      };
      let result = await propertiesQuery(params);
      if (result && result.features && result.features[0]) {
        let feature = result.features[0];
        this.$refs.region.source.addFeature(feature);
        this.myMap.map.getView().fit(feature.getGeometry());
        let geometry = feature.getGeometry();
        let polygon = geometry.getCoordinates();
        let extent = geometry.getExtent();
        return { polygon, extent };
      }
    },
  },
};
</script>
