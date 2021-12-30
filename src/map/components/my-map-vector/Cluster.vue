<script>
/**
 * 聚合图层
 * 在Json组件基础上，增加是否聚合、距离参数
 */
import VectorJson from "./Json";
import DxVectorLayer, { getStyles } from "@map/js/layer/vectorLayer";
import DxClusterSource from "@map/js/source/cluster";
import { getScaleDenominatorByView } from "@map/js/tool/baseTool";

let styleCache = {};

export default {
  name: "MyMapVectorCluster",
  mixins: [VectorJson],
  props: {
    /**
     * @property {Boolean} [isCluster] = false - 是否聚合 主要针对点图层
     */
    isCluster: {
      type: Boolean,
      default: false
    },
    /**
     * @property {Number} [distance] = 20 - 聚合距离，单位是px,需要求isCluster = true时有效
     */
    distance: {
      type: Number,
      default: 20
    },
    numOffsetX: {
      type: Number,
      default: 10
    },
    numOffsetY: {
      type: Number,
      default: 10
    },
    scales: {
      // 与distances搭配使用,小于160000，距离为0，大于160000 ，距离为80，大于600000，距离为160
      type: Array,
      default: () => {
        return [160000, 600000, 1200000];
      }
    },
    distances: {
      type: Array,
      default: () => {
        return [80, 160, 320];
      }
    },
    clusterStyles: {
      type: [Object, Array, Function],
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      localDistance: this.distance,
      clusterSource: null,
      view: null,
      originalStyle: null
    };
  },
  watch: {
    distance() {
      this.localDistance = this.distance;
    },
    localDistance() {
      if (this.layer && this.isCluster && this.clusterSource) {
        this.clusterSource.setDistance(this.localDistance);
      }
    }
  },
  methods: {
    init() {
      if (this.layer) {
        return;
      }

      this.initSource();

      // 聚合图层数据源
      if (this.isCluster) {
        this.clusterSource = new DxClusterSource({
          distance: this.localDistance,
          source: this.source
        });
      }

      // 初始化图层
      this.layer = new DxVectorLayer({
        source: this.clusterSource ? this.clusterSource : this.source,
        styles: this.styles
      });

      this.originalStyle = this.layer.getStyle();

      this.initLayerFinish();

      this.layer.setHoverStyles(this.hoverStyles);

      let map = this.myMap.map;
      if (map) {
        this.view = map.getView();
        this.changeDistanceByView({ target: this.view });
        this.view.on("change:resolution", this.changeDistanceByView);
      }
    },
    changeDistanceByView(e) {
      if (!this.isCluster) {
        return;
      }

      let scale = getScaleDenominatorByView(e.target);
      if (scale < (this.scales[0] || 160000)) {
        this.layer.setSource(this.source);
        this.layer.setStyle(this.originalStyle);
      } else {
        this.layer.setSource(this.clusterSource);
        this.pushNumStyle();
        if (this.scales.length < 2) {
          return;
        }

        for (let i = 0; i < this.scales.length - 1; i++) {
          if (scale > this.scales[i]) {
            this.localDistance = this.distances[i] || this.distance;
          }
        }
      }
    },
    pushNumStyle() {
      if (!this.layer) {
        return;
      }
      if (this.clusterStyles) {
        this.layer.setStyle(getStyles(this.clusterStyles));
      } else {
        let styleFunction = (feature, resolution) => {
          let result = [];
          if (typeof this.originalStyle === "function") {
            let styles = this.originalStyle(feature, resolution);
            result = [...styles];
          } else {
            result.push(this.originalStyle);
          }

          let style = this.getNumStyle(feature);
          style && result.push(style);
          return result;
        };
        this.layer.setStyle(styleFunction);
      }
    },
    getNumStyle(feature) {
      let features = feature.get("features");
      if (!features) {
        return null;
      }
      let size = features.length;
      if (size <= 1) {
        return null;
      }

      let style = styleCache[size];
      if (!style) {
        style = {
          circle: {
            radius: 10,
            stroke: null,
            fill: {
              color: "#f00"
            },
            displacement: [this.numOffsetX, -this.numOffsetY + 1]
          },
          text: {
            text: size.toString(),
            fill: {
              color: "#fff"
            },
            font: "8px",
            offsetX: this.numOffsetX,
            offsetY: this.numOffsetX
          }
        };
        styleCache[size] = style;
      }
      return getStyles(style);
    }
  },
  destroyed() {
    if (this.view) {
      this.view.un("change:resolution", this.changeDistanceByView);
      this.view = null;
    }
  }
};
</script>
