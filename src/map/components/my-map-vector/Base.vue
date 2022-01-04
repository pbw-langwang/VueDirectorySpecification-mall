<script>
/**
 * 矢量图层基础组件
 * 实现对数据、图层的基本操作
 */
import VectorSourceFactory from "@map/js/source/VectorSourceFactory";
import { DEFAULT_PROJECTION } from "@map/js/common";

export default {
  name: "MyMapVectorBase",
  inject: ["myMap"],
  render() {
    return null;
  },
  props: {
    /**
     * @property {object} dataSource
     * @property {string} dataSource.type - "1" | "2" | "3" | "4" 参考 GEOJSON_SOURCE_TYPE
     * @property {object | String | Array} dataSource.data -  数据，需配合type的值
     * @property {string} dataSource.geometryKey = "type" -  几何类型对应的key值
     */
    dataSource: {
      type: Object,
      default: () => {
        return null;
      }
    },
    dataType: {
      // 数据类型 json / wkt
      type: String,
      default: () => {
        return "json";
      }
    },
    name: {
      // 图层名
      type: String,
      default: null
    },
    id: {
      // 图层ID
      type: [String, Number],
      default: null
    },
    zindex: {
      type: Number,
      default: 0
    },
    isFit: {
      type: Boolean,
      default: false
    },
    fitOption: {
      type: Object,
      default: () => {
        return null;
      }
    },
    // 控制地图缩小（好像只控制了部分），看popup的显示就知道了
    minZoom: {
      type: Number,
      default: 5
    },
    // 控制地图放大（好像只控制了部分），看popup的显示就知道了
    maxZoom: {
      type: Number,
      default: 9
    }
  },
  data() {
    return {
      layer: null,
      source: null
    };
  },
  watch: {
    dataSource() {
      this.clear();
      this.addData(this.dataSource);
    }
  },
  methods: {
    /**
     * 矢量图层的初始化
     * @abstract
     */
    init() {},
    /**
     * 数据源的初始化
     */
    initSource() {
      let options = { projection: this.myMap.map.projection };
      // if (this.dataType === "json") {
      //   this.source = new GeoJSONSource(options);
      // } else if (this.dataType === "wkt") {
      //   this.source = new WktSource(options);
      // }
      this.source = new VectorSourceFactory(options).create(this.dataType);

      // 数据源添加数据
      this.addData(this.dataSource);
    },
    /**
     * 图层初始化完后，将图层增加到地图中
     */
    initLayerFinish() {
      if (this.layer) {
        // 图层绑定vue组件实例
        this.layer._vm = this;
        // 指定图层id
        this.layer.id = this.id;
        // 指定图层名
        this.layer.name = this.name;
        this.layer.setZIndex(this.zindex);
        // 设置显示级别
        this.layer.setMinZoom(this.minZoom);
        this.layer.setMaxZoom(this.maxZoom);
        // 将图层添加地图中
        this.myMap.map.addLayer(this.layer);

        if (this.layer) {
          this.fit();
        }

        /**
         * 图层完成时触发
         */
        this.$emit("ready");
      }
    },
    /**
     * 增加数据
     */
    addData(dataSource) {
      if (this.source && dataSource) {
        this.source.addSourceData(dataSource);
      }

      if (this.layer) {
        this.fit();
      }
    },
    getItems(key, value) {
      if (this.source) {
        return this.source.getFeatures().filter(f => {
          let properties = f.getProperties();
          if (properties[key] === value) {
            let cloneGeometry = f.getGeometry().clone();
            let outGeometry = cloneGeometry.transform(
              this.myMap.map.projection,
              DEFAULT_PROJECTION
            );
            f.outGeometry = outGeometry;
            f._layer = this.layer; // 绑定图层
            return true;
          }
          return false;
        });
      }
      return null;
    },
    fit() {
      if (this.source && this.isFit && this.source.getFeatures().length > 0) {
        let extent = this.source.getExtent();
        extent &&
          this.myMap.map
            .getView()
            .fit(extent, { duration: 3000, ...this.fitOption });
      }
    },
    /**
     * 清空source数据
     */
    clear() {
      if (this.source) {
        this.source.clear();
      }
    },
    /**
     * 清空source,移除图层
     */
    dispose() {
      if (this.myMap && this.myMap.map && this.layer) {
        this.clear();
        this.myMap.map.removeLayer(this.layer);
      }
    }
  },
  /**
   * 地图加载完后，调用图层初始化
   */
  mounted() {
    this.myMap.mapReady(this.init);
  },
  /**
   * 移除
   */
  beforeDestroy() {
    this.dispose();
  },
  beforeUnmount() {
    this.dispose();
  }
};
</script>
