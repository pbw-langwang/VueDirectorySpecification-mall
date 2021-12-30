import { Map, View } from "ol";
import { transform, transformExtent } from "ol/proj.js";
import { defaults as defaultControls, ScaleLine, Zoom } from "ol/control.js";
import { defaults as defaultInteraction } from "ol/interaction";
import LayerGroup from "ol/layer/Group";
import { Pointer as PointerInteraction } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";

import { DEFAULT_PROJECTION } from "./common";
import { getImageLayer } from "./layer";
import { registerProj } from "./projections";
import DxClusterSource from "./source/cluster";

import "ol/ol.css";

/**
 * @typedef {Object} Options
 * @property {HTMLElement|string} target = "map" - 地图对象容器
 * @property {string} [projection] = "EPSG:4326" - 坐标系
 * @property {number[2]} [center] = [0,0] - 中心点经纬度坐标
 * @property {number} [zoom] = 0 - 初始化缩放级别
 * @property {number} [minZoom] = 0 - 最小缩放级别
 * @property {number} [maxZoom] = 22 - 最大缩放级别
 * @property {import("ol/extent")} [extent] - 经纬度范围
 * @property {Object} [mapOptions] - 地图ol/map其他参数，用于扩展
 * @property {Object} [viewOptions] - 视图ol/view其他参数，用于扩展
 * @property {Array<Object>} [layers] - 底图图层数据集合
 */

class DxMap extends Map {
  /**
   * 地图对象参数
   * @param {Options} options
   */
  constructor(options) {
    options = { ...options };

    let target = options.target || "map";

    let projection = options.projection || DEFAULT_PROJECTION;

    let center = options.center || [0, 0];

    if (projection !== DEFAULT_PROJECTION) {
      center = transform(center, DEFAULT_PROJECTION, options.projection);
    }

    let zoom = options.zoom || 0;

    let minZoom = options.minZoom || 0;

    let maxZoom = options.maxZoom || 22;

    let extent = options.extent;
    if (
      Array.isArray(extent) &&
      extent.length === 4 &&
      projection !== DEFAULT_PROJECTION
    ) {
      extent = transformExtent(extent, DEFAULT_PROJECTION, options.projection);
    }

    let mapOptions = { ...options.mapOptions };

    let viewOptions = { ...options.viewOptions };

    let params = {
      ...mapOptions,
      target: target,
      layers: [],
      view: new View({
        ...viewOptions,
        projection: projection,
        center: center,
        zoom: zoom,
        minZoom: minZoom,
        maxZoom: maxZoom,
        extent: extent
      }),
      controls: defaultControls({
        attribution: false,
        zoom: false,
        rotate: false
      }),
      interactions: defaultInteraction({
        doubleClickZoom: false
      })
    };

    super(params);

    // 扩展坐标系
    registerProj();

    // 添加一个空的底图图层，
    // 因为影像图层采用异步的方式加载，在加载矢量数据时存在图层顺序混乱的情况
    // 因此，地图初始化后占用一个图层位置，位于最底层
    let baseLayerGroup = new LayerGroup();
    this.addLayer(baseLayerGroup);

    this.projection = projection;

    this.extent = extent;

    this.baseLayers = options.layers || [];

    this.baseLayerIndex = 0;

    this.addBaseLayer();

    // 监听地图容器的大小，改变时触发地图的更新
    if ("undefined" !== typeof ResizeObserver) {
      let element = this.getTargetElement();
      if (element) {
        const resizeObserver = new ResizeObserver(() => {
          this.updateSize();
        });

        resizeObserver.observe(element);
      }
    }

    // 屏蔽浏览器默认右键
    document.oncontextmenu = function(e) {
      return false;
    };
  }

  //#region  图层

  //#region 底图操作

  /**
   * 获取底图图层json数据
   * @returns layers
   */
  getBaseLayers() {
    return this.baseLayers;
  }

  /**
   * 设置底图图层数据
   * @param {Array} layers
   * @param {number} index
   */
  setBaseLayers(layers, index) {
    this.baseLayers = layers;
    this.baseLayerIndex = index || 0;
    // 更新图层
    this.addBaseLayer();
  }

  /**
   * 切换底图
   * @param {number} index
   */
  changeBaseLayer(index) {
    this.baseLayerIndex = index || 0;
    // 更新图层
    this.addBaseLayer();
  }

  /**
   * 以LayerGroup的方式添加底图，
   * @param {Array<Array<Object> | Object>} options
   * @param {number} [index] = 0 图层集合索引值
   */
  async addBaseLayer(options, index) {
    this.baseLayers = options ? options : this.baseLayers;
    this.baseLayerIndex = index || this.baseLayerIndex;
    let len = this.baseLayers.length;
    if (len === 0 || this.baseLayerIndex > len) {
      return;
    }

    const item = this.baseLayers[this.baseLayerIndex];

    let data = Array.isArray(item) ? item : item.data;
    if (Array.isArray(data)) {
      let layers = [];
      for (let i = 0; i < data.length; i++) {
        let layer = await this.getImageLayer_(data[i]);
        if (layer) {
          layers.push(layer);
        }
      }

      let baseLayerGroup = new LayerGroup({
        layers: layers
      });
      this.getLayers().setAt(0, baseLayerGroup);
    }
  }

  clearBaseLayer() {
    let baseLayerGroup = new LayerGroup();
    this.getLayers().setAt(0, baseLayerGroup);
  }
  //#endregion 底图操作

  //#region 地图服务类型的图层加载

  /**
   * 添加图层
   * @param {*} param
   */
  async addImageLayer(param, isFit) {
    let layer = await this.getImageLayer_(param);
    if (layer) {
      layer.id = param.id;
      layer.name = param.name;
      this.addLayer(layer);

      if (isFit) {
        this.getView().fit(layer.getExtent());
      }
    }
    return layer;
  }

  /**
   * 生成地图服务图层
   * @param {*} param
   */
  async getImageLayer_(param) {
    let layer = await getImageLayer(param);
    if (layer) {
      // 图层范围
      if (layer.defaultExtent) {
        let extent = transformExtent(
          layer.defaultExtent,
          DEFAULT_PROJECTION,
          this.projection
        );
        layer.setExtent(extent);
      } else {
        // 视图范围
        if (this.extent) {
          layer.setExtent(this.extent);
        }
      }
    }
    return layer;
  }

  //#endregion 地图服务类型的图层加载

  //#region 图层操作

  /**
   * 根据图层的key/value,获取图层
   * @param  {string} key
   * @param  {*} value
   * @returns Array
   */
  getLayerByKey(key, value) {
    let result = [];
    if (key && value) {
      let layers = this.getLayers().getArray();
      for (let i = 0; i < layers.length; i++) {
        const item = layers[i];
        if (item[key] === value) {
          result.push(item);
        }
      }
    }
    return result;
  }

  /**
   * 根据图层的key/value,确定layer在map的索引值,不存在返回-1
   * @param  {string} key
   * @param  {*} value
   * @returns number
   */
  getLayerIndexByKey(key, value) {
    let index = -1;
    if (key && value) {
      let layers = this.getLayers().getArray();
      for (let i = 0; i < layers.length; i++) {
        const item = layers[i];
        if (item[key] === value) {
          index = i;
          break;
        }
      }
    }
    return index;
  }

  /**
   * 从index1、index2的位置互换
   * @param  {number} index1
   * @param  {number} index2
   */
  swapLayerByIndex(index1, index2) {
    let collection = this.getLayers();
    let item = collection.removeAt(index1);
    collection.insertAt(index2, item);
  }

  //#endregion 图层操作

  //#endregion 图层

  //#region 要素

  /**
   * 根据坐标获取图层最上层要素，增加_layer、outGeometry两个属性
   * @param  {import("ol/coordinate")} coordinate
   * @param  [string] key 属性键名
   * @param  [string] value 属性值
   * @returns feature
   */
  getFeatureByCoordinate(coordinate, key, value) {
    let layers = this.getLayers()
      .getArray()
      .filter(x => x instanceof VectorLayer);
    let featureList = [];
    layers.forEach(x => {
      let source = x.getSource();
      if (source instanceof DxClusterSource) {
        source = source.getSource();
      }

      let features = source.getFeaturesInExtent([
        coordinate[0] - 1,
        coordinate[1] - 1,
        coordinate[0] + 1,
        coordinate[1] + 1
      ]);
      features.forEach(feature => {
        if (key && value) {
          let info = feature.getProperties();
          if (info && info[key] === value) {
            feature._layer = x;
            featureList.push(feature);
          }
        } else {
          feature._layer = x;
          featureList.push(feature);
        }
      });
    });

    let feature = featureList[0];
    let matchFeature = null;
    if (feature) {
      matchFeature = feature;

      const features = feature.get("features") || []; // 针对聚合图层
      if (features[0]) {
        matchFeature = features[0];
        matchFeature._layer = feature._layer;
      }

      let cloneGeometry = matchFeature.getGeometry().clone();
      let outGeometry = cloneGeometry.transform(
        this.projection,
        DEFAULT_PROJECTION
      );
      matchFeature.outGeometry = outGeometry;
    }

    return matchFeature;
  }

  /**
   * 根据坐标获取视图范围内最上层要素，增加_layer、outGeometry两个属性
   * @param  {import("ol/coordinate")} coordinate
   * @returns feature
   */
  getFeatureInView(coordinate) {
    const pixel = this.getPixelFromCoordinate(coordinate);
    let featureList = [];
    this.forEachFeatureAtPixel(pixel, (feature, layer) => {
      feature._layer = layer;
      featureList.push(feature);
    });
    let feature = featureList[0];
    let matchFeature = null;
    if (feature) {
      matchFeature = feature;

      const features = feature.get("features") || []; // 针对聚合图层
      if (features[0]) {
        matchFeature = features[0];
        matchFeature._layer = feature._layer;
      }

      let cloneGeometry = matchFeature.getGeometry().clone();
      let outGeometry = cloneGeometry.transform(
        this.projection,
        DEFAULT_PROJECTION
      );
      matchFeature.outGeometry = outGeometry;
    }

    return matchFeature;
  }

  //#endregion 要素

  //#region  控件

  /**
   * 添加比例尺
   * @param { import("ol/control/ScaleLine").Options} [scaleOptions]
   */

  addScaleLine(scaleOptions) {
    let options = scaleOptions || { bar: true, text: true, minWidth: 125 };
    let scaleLine = new ScaleLine(options);
    this.addControl(scaleLine);
  }

  // 添加放大缩小控件
  addZoom() {
    let zoom = new Zoom();
    this.addControl(zoom);
  }

  //#endregion 控件

  //#region 交互事件

  /**
   * @param {Object.<string, function>} options
   * string 为 MapBrowserEventType的值
   * function ({features,e}) = {}
   */
  addPointerHandle(options) {
    let InteractionOptions = {
      handleEvent: e => {
        const type = e.type;
        let coordinate =
          e.coordinate || e.map.getEventCoordinate(e.originalEvent);
        let feature = e.map.getFeatureInView(coordinate);

        let callback = options[type];
        if (callback) {
          callback({ feature: feature, e });
        }
        return true;
      }
    };
    let pointerInteraction = new PointerInteraction(InteractionOptions);
    this.addInteraction(pointerInteraction);
  }

  //#endregion 交互事件

  //#region 工具

  home({ extent, zoom, center }) {
    if (Array.isArray(extent)) {
      extent = transformExtent(extent, DEFAULT_PROJECTION, this.projection);
      this.getView().fit(extent, { maxZoom: 17 });
    }

    if (Array.isArray(center)) {
      center = transform(center, DEFAULT_PROJECTION, this.projection);
      this.getView().setCenter(center);
    }

    if (zoom) {
      this.getView().setZoom(zoom);
    }
  }

  /**
   * 清除除底图外的其他所有图层及弹出来
   */
  clear() {
    let layers = this.getLayers();
    const baseLayer = layers.getArray()[0];
    // 移除图层
    layers.clear();
    // 添加底图
    this.addLayer(baseLayer);

    // 移除弹出框
    this.getOverlays().clear();
  }

  //#endregion 工具

  //#region 坐标、范围等输入输出
  inputCoordinate(coordinate) {
    if (Array.isArray(coordinate)) {
      return transform(coordinate, DEFAULT_PROJECTION, this.projection);
    }
    return;
  }

  inputExtent(extent) {
    if (Array.isArray(extent)) {
      return transformExtent(extent, DEFAULT_PROJECTION, this.projection);
    }
    return;
  }

  outputCoordinate(coordinate) {
    if (Array.isArray(coordinate)) {
      return transform(coordinate, this.projection, DEFAULT_PROJECTION);
    }
    return;
  }

  outputExtent(extent) {
    if (Array.isArray(extent)) {
      return transformExtent(extent, this.projection, DEFAULT_PROJECTION);
    }
    return;
  }

  //#endregion 输出
}

export default DxMap;

/**
 * 根据像素范围，裁剪地图生成base64图片
 * @param {Object} opt
 * @param  {ol.Map} opt.map 地图
 * @param  {Number} opt.left 左侧像素
 * @param  {Number} opt.top 上侧像素
 * @param  {Number} opt.width 被裁剪的宽度
 * @param  {Number} opt.height 被裁剪的高度
 * @param  {Number} opt.owidth 输出宽度 默认等于被裁剪的宽度
 * @param  {Number} opt.oheight 输出高度 默认等于被裁剪的高度
 * @param  {Function} opt.callback  fn(image,width,height)
 */
export function exportMapBase64({
  map,
  left = 0,
  top = 0,
  width,
  height,
  owidth,
  oheight,
  callback
}) {
  map.once("rendercomplete", () => {
    const mapCanvas = document.createElement("canvas");
    const size = map.getSize();
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
    const mapContext = mapCanvas.getContext("2d");
    Array.prototype.forEach.call(
      document.querySelectorAll(".ol-layer canvas"),
      function(canvas) {
        if (canvas.width > 0) {
          const opacity = canvas.parentNode.style.opacity;
          mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
          const transform = canvas.style.transform;
          // Get the transform parameters from the style's transform matrix
          const matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(",")
            .map(Number);
          // Apply the transform to the export map context
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          mapContext.drawImage(canvas, 0, 0);
        }
      }
    );
    let base64 = mapCanvas.toDataURL();
    let params = {
      image: base64,
      width: mapCanvas.width,
      height: mapCanvas.height
    };
    callback(params);
  });
  map.renderSync();
}
