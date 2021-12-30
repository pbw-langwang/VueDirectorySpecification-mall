import { Image as ImageLayer } from "ol/layer";
import ImageArcGISRest from "ol/source/ImageArcGISRest";
import LAYER_DATA_TYPE from './layerDataType';
import {getParamByUrl} from '../utils/url'

/**
 * @typedef {Object} Options
 * @property {string} url - ArcGIS Serve发布的地图服务
 * @property {string} projection - 坐标系
 * @property {string} [layers] - 默认加载所有,可选择指定一个或多个图层(以逗号隔开)，如 "1" 或 "0,1,2"
 * @property {boolean} [crossOrigin] - 跨域，跨域访问时需配置
 * @property {Object} [imageOptions] - ol/layer/image其他参数，用于扩展
 * @property {Object<string,*>} [restOption] - 其他ArcGIS Rest parameters Service
 * defaults will be used for any fields not specified. `FORMAT` is `PNG32` by default. `F` is
 * `IMAGE` by default. `TRANSPARENT` is `true` by default.  `BBOX`, `SIZE`, `BBOXSR`, and `IMAGESR`
 * will be set dynamically. Set `LAYERS` to override the default service layer visibility. See
 * {@link https://developers.arcgis.com/rest/services-reference/export-map.htm}
 */

class DxArcGISImageLayer extends ImageLayer {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    options = { ...options };

    let url = options.url;    
    let urlParams = getParamByUrl(url);
    
    let index = url.indexOf("?");
    if (index !=-1){
      url = url.slice(0,index);
    }
  
    let projection = options.projection;

    let layers = options.layers;
    if (layers != null) {
      layers = `show:${layers}`;
    } else {
      layers = "*";
    }

    let crossOrigin = options.crossOrigin ? "Anonymous" : null;

    let ratio = 1;

    let imageOptions = { ...options.imageOptions };

    let restOption = { ...options.restOption, ...{ layers }, ...urlParams };

    let params = {
      ...imageOptions,
      source: new ImageArcGISRest({
        url,
        crossOrigin,
        projection,
        ratio,
        params: restOption
      })
    };

    super(params);

    this.layerDateType = LAYER_DATA_TYPE.IMAGE;
  }
}

export default DxArcGISImageLayer;
