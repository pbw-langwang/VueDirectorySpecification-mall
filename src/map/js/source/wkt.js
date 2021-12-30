import VectorSource from "ol/source/Vector";
import WKT from "ol/format/WKT";

import { DEFAULT_PROJECTION } from "../common";

/**
 * geojson 数据源类型
 */
export const WKT_SOURCE_TYPE = {
  List: "1",
  Feature: "2",
  Url: "4"
};

class WktSource extends VectorSource {
  constructor(options) {
    options = { ...options };

    let projection = options.projection;

    let format = new WKT();

    // setUrl时有效
    options.format = format;
    super(options);

    this.format = format;

    this.projection = projection;
  }

  /**
   * 通过geojson url设置数据源,会清空原有数据
   * @param {string} url
   */
  setSourceByUrl(url) {
    this.setUrl(url);
    this.refresh();
  }

  /**
   * 将包含type 和 coordinates属性的数组转化为FeatureCollection，添家到source中
   * @param  {Array<Object>} list
   * @param  {string} key="type" - 几何类型的键值
   */
  addByList(list, key = "type", idKey) {
    if (!Array.isArray(list)) {
      return;
    }

    let features = [];
    list.forEach(x => {
      if (x[key]) {
        let feature = this.format.readFeature(x[key], {
          dataProjection: DEFAULT_PROJECTION,
          featureProjection: this.projection
        });
        let prop = { ...x };
        delete prop.geometry;
        feature.setProperties(prop);

        if (x[idKey]) {
          feature.setId(x[idKey]);
        }
        features.push(feature);
      }
    });
    this.addFeatures(features);
  }

  addByFeature(object, key = "wkt", idKey = "id") {
    if (!object || !object[key]) {
      return;
    }

    let feature = this.format.readFeature(object[key], {
      dataProjection: DEFAULT_PROJECTION,
      featureProjection: this.projection
    });
    let prop = { ...object };
    delete prop.geometry;
    feature.setProperties(prop);

    if (object[idKey]) {
      feature.setId(object[idKey]);
    }

    this.addFeature(feature);
  }

  /**
   *
   * @param {Object} param
   * @param {string} param.type - "1"  | "4" 参考 WKT_SOURCE_TYPE
   * @param {Object} param.data -  数据，需配合type的值
   * @param {string} [param.geometryKey] = "type" -  几何类型对应的key值
   * @param  {string} [param.idKey] ="id" - 要素id的键值
   */
  addSourceData({ type, data, geometryKey, idKey = "id" }) {
    if (!type || !data) {
      return;
    }

    switch (type) {
      case WKT_SOURCE_TYPE.List:
        this.addByList(data, geometryKey, idKey);
        break;
      case WKT_SOURCE_TYPE.Feature:
        this.addByFeature(data, geometryKey, idKey);
        break;
      case WKT_SOURCE_TYPE.Url:
        this.setSourceByUrl(data);
        break;
      default:
        break;
    }
  }
}

export default WktSource;
