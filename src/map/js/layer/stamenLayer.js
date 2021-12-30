import Stamen from "ol/source/Stamen";
import TileLayer from "ol/layer/Tile";
import LAYER_DATA_TYPE from "./layerDataType";

/**
 * 通过包含{x}、{y}、{z}的地图服务加载图层
 * @typedef {Object} Options
 * @property {string} [layer] = "toner"  - "toner"、"terrain"、"watercolor"
 * @property {Object} [tileOptions] - ol/layer/tile其他参数，用于扩展
 */

/**
 * stamen 瓦片图层
 */
class DxStamenLayer extends TileLayer {
  /**
   * @param {Options} options
   */
  constructor(options) {
    options = { ...options };

    let layer = options.layers || "toner";

    let tileOptions = { ...options.tileOptions };

    let wrapX = options.wrapX || false;

    let params = {
      ...tileOptions,
      source: new Stamen({
        layer,
        wrapX
      })
    };

    super(params);

    this.layerDateType = LAYER_DATA_TYPE.STAMEN;
  }
}

export default DxStamenLayer;
