<template>
  <MyMapVectorJSON
    v-if="data"
    :dataSource="data.dataSource"
    :styles="data.styles"
    :hoverStyles="data.hoverStyles"
    ref="frame"
  ></MyMapVectorJSON>
</template>

<script>
import MyMapVectorJSON from "./../my-map-vector/Json";
// import { getMapFrames } fro../../js/framing/framing.worker.jsing";
import Worker from "../../js/framing/framing.worker.js";
import { propertiesQuery } from "../../js/query/query";
import { cities_mapServer } from "../../config";
import { DEFAULT_PROJECTION } from "../../js/common";

const styles = (feature, resolution) => {
  let styles = [
    {
      stroke: {
        color: "#8B0000",
        width: 1
      },
      fill: {
        color: "transparent"
      }
    }
  ];
  let code = feature.get("code");
  styles.push({
    text: {
      text: code,
      font: "48px",
      fill: {
        color: "#8B0000"
      },
      scale: 2
    }
  });
  return styles;
};

const hoverStyles = (feature, resolution) => {
  let styles = [
    {
      stroke: {
        color: "#8B0000",
        width: 1
      },
      fill: {
        color: "rgba(139,0,0,0.4)"
      }
    }
  ];
  let code = feature.get("code");
  styles.push({
    text: {
      text: code,
      font: "48px",
      fill: {
        color: "#8B0000"
      },
      scale: 2
    }
  });
  return styles;
};

export default {
  components: {
    MyMapVectorJSON
  },
  props: {
    cityCode: {
      type: String,
      default: null
    },
    scale: {
      type: String,
      default: "B"
    }
  },
  data() {
    return {
      data: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let polygon = null;
      let extent = null;
      if (this.cityCode) {
        let feature = await this.getRegionPolygon();
        if (feature) {
          let geometry = feature.getGeometry();
          polygon = geometry.getCoordinates();
          extent = geometry.getExtent();
        }
      }
      let params = {
        extent: extent,
        scale: this.scale,
        polygon
      };

      let worker = new Worker();
      worker.postMessage(params);
      worker.addEventListener("message", e => {
        let result = e.data;
        this.showFrameOnMap(result);
        worker.terminate();
      });
    },
    showFrameOnMap(frames) {
      let list = frames.map(x => {
        let extent = x.extent;
        return {
          ...x,
          geometryType: "Polygon",
          coordinates: [
            [
              [extent[0], extent[1]],
              [extent[2], extent[1]],
              [extent[2], extent[3]],
              [extent[0], extent[3]],
              [extent[0], extent[1]]
            ]
          ]
        };
      });
      let dataSource = {
        type: "1", // List
        data: list,
        geometryKey: "geometryType"
      };

      this.data = {
        styles: styles,
        hoverStyles: hoverStyles,
        dataSource: dataSource
      };
    },
    async getRegionPolygon() {
      let params = {
        layer: {
          type: "arcgis",
          url: cities_mapServer.url
        },
        layerId: cities_mapServer.id,
        layerProjection: cities_mapServer.projection,
        params: {
          where: [
            {
              key: cities_mapServer.codeKey,
              operator: "=",
              value: this.cityCode
            }
          ]
        },
        featureProjection: DEFAULT_PROJECTION
      };
      let result = await propertiesQuery(params);
      if (result && result.features && result.features[0]) {
        return result.features[0];
      }
    }
  }
};
</script>
