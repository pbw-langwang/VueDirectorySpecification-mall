import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import LAYER_DATA_TYPE from "./layerDataType";

/**
 * @typedef {Object} Options
 * @property {string} url - WMS地图服务
 * @property {string} projection - 坐标系
 * @property {boolean} [crossOrigin] - 跨域，跨域访问时需配置
 * @property {Object} [imageOptions] - ol/layer/image其他参数，用于扩展
 * @property {Object<string,*>} [restOption] - 其他WMS request parameters
 * `STYLES` is `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 */
class DxWMSLayer extends ImageLayer {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    options = { ...options };

    let url = options.url;

    let projection = options.projection;

    let crossOrigin = options.crossOrigin ? "Anonymous" : null;

    let ratio = 1;

    let imageOptions = { ...options.imageOptions };

    let restOption = { ...options.restOption };

    let params = {
      ...imageOptions,
      source: new ImageWMS({
        url,
        crossOrigin,
        projection,
        ratio,
        params: restOption
      })
    };

    super(params);

    this.layerDateType = LAYER_DATA_TYPE.IMAGE;

    this.defaultExtent = options.extent;
  }
}

export default DxWMSLayer;
