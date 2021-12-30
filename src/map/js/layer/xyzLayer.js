import TileLayer from "ol/layer/Tile";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import XYZ from "ol/source/XYZ";
import LAYER_DATA_TYPE from "./layerDataType";

/**
 * 通过包含{x}、{y}、{z}的地图服务加载图层
 * @typedef {Object} Options
 * @property {string} url  - 地图服务地址,需包含{x}、{y}、{z}
 * @property {string} projection  - 坐标系
 * @property {import("ol/tilegrid/WMTS").Options} [tileGrid] - 格网，自定义格网需配置
 * @property {boolean} [crossOrigin] - 跨域，跨域访问时需配置
 * @property {boolean} [wrapX] = false - 坐标横向扩展
 * @property {Object} [tileOptions] - ol/layer/tile其他参数，用于扩展
 * @property {Object} [xyzOptions] - ol/source/xyz其他参数，用于扩展
 */

class DxXYZLayer extends TileLayer {
  /**
   * xyz 图层参数
   * @param {Options} options
   */
  constructor(options) {
    options = { ...options };

    let url = options.url;

    let projection = options.projection;

    let tileGrid = options.tileGrid ? new WMTSTileGrid(options.tileGrid) : null;

    let crossOrigin = options.crossOrigin ? "Anonymous" : null;

    let wrapX = options.wrapX || false;

    let tileOptions = { ...options.tileOptions };

    let xyzOptions = { ...options.xyzOptions };

    let params = {
      ...tileOptions,
      source: new XYZ({
        ...xyzOptions,
        url,
        crossOrigin,
        wrapX,
        projection,
        tileGrid
      })
    };

    super(params);

    this.layerDateType = LAYER_DATA_TYPE.TILE;
  }
}

export default DxXYZLayer;
