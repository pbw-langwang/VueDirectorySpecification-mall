import { Image as ImageLayer } from "ol/layer";
import ImageWMS from "ol/source/ImageWMS";
import TileWMS from 'ol/source/TileWMS';
import TileLayer from 'ol/layer/Tile';
import LAYER_DATA_TYPE from './layerDataType';

/**
 * @typedef {Object} Options
 * @property {string} url - GeoServe发布的地图服务
 * @property {string} projection - 坐标系
 * @property {string} [layers] - 服务Identifier
 * @property {boolean} [crossOrigin] - 跨域，跨域访问时需配置
 * @property {Object} [imageOptions] - ol/layer/image其他参数，用于扩展
 * @property {Object<string,*>} [restOption] - 其他WMS request parameters
 * `STYLES` is `''` by default. `VERSION` is `1.3.0` by default. `WIDTH`, `HEIGHT`, `BBOX`
 * and `CRS` (`SRS` for WMS version < 1.3.0) will be set dynamically.
 */
class DxGeoServerImageLayer extends ImageLayer {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    options = { ...options };

    let url = options.url;

    let projection = options.projection;

    let layers = options.layers;

    let crossOrigin = options.crossOrigin ? "Anonymous" : null;

    let ratio = 1;

    let imageOptions = { ...options.imageOptions };

    let restOption = { ...options.restOption, ...{ layers } };

    let params = {
      ...imageOptions,
      source: new ImageWMS({
        url,
        crossOrigin,
        projection,
        ratio,
        params: restOption,
        serverType: "geoserver"
      })
    };

    super(params);

    this.layerDateType = LAYER_DATA_TYPE.IMAGE;
  }
}

export default DxGeoServerImageLayer;
