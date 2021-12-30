import Point from "ol/geom/Point";
import { cities_mapServer } from "../../config";
import { queryArcGISSpatial } from "../query/arcgisQuery";

/**
 * 根据行政编号，返回地图的缩放级别
 * @param  {string} adcode 行政编码
 * @returns {number} zoom
 */
export function getZoomByAdCode(adcode) {
  if (!adcode) {
    return;
  }
  // 全国
  if (adcode.substr(0, 2) == "10") {
    return 4;
  }

  // 省份
  if (adcode.substr(2, 2) == "00") {
    return 10;
  }

  // 城市
  return 11;
}

/**
 * 根据级别，调整行政编码
 * @param  {string} adcode
 * @param  {number} zoom
 * @returns {string} adcode
 */
export function adjustAdCodeByZoom(adcode, zoom) {
  if (zoom <= 8) {
    return "100000";
  } else if (zoom <= 10) {
    return adcode.substr(0, 2) + "0000";
  } else {
    return adcode;
  }
}

/**
 * 找到城市详细信息
 * @param  {object} data
 * @param  {string} adcode
 * @returns object
 */
export function getCityInfoByAdCode(data, adcode) {
  if (!data || !adcode) {
    return;
  }

  // 省份
  let province_adcode = adcode.substr(0, 2) + "0000";
  let province_info = data[province_adcode];
  if (province_adcode === adcode) {
    return province_info;
  }

  // 城市
  let city_adcode = adcode.substr(0, 4) + "00";
  let city_info = null;
  let cities = province_info.cities;
  cities.forEach(c => {
    if (c.adcode === city_adcode) {
      city_info = c;
    }
  });

  if (city_adcode === adcode) {
    return city_info;
  }

  return null;
}

export function getCityList(data) {
  if (!data) {
    return;
  }

  let result = [];
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const item = data[key];
      // let text = `${item.adcode},${item.areacode},${item.name},${item.name_en},${item.label},${item.spell},${item.short},${item.index},${item.x},${item.y},${item.citycode}`;
      result.push(item);
      if (Array.isArray(item.cities)) {
        item.cities.forEach(x => {
          // let t = `${x.adcode},${x.areacode},${x.name},${x.name_en},${x.label},${x.spell},${x.short},${x.index},${x.x},${x.y},${x.citycode}`;
          result.push(x);
        });
      }
    }
  }

  return result;
}

/**
 * 通过arcgis 点空间查询，判断该点所在的行政区划，返回行政编码
 * @param  {import("ol/coordinate")} coordinate 点坐标
 * @returns object {adcode,name}
 */
export async function getCityByCoordinate(coordinate, projection) {
  if (!coordinate) {
    return;
  }

  let params = {
    url: cities_mapServer.url,
    layerId: cities_mapServer.id,
    geometryType: "Point",
    geometry: new Point(coordinate),
    layerProjection: cities_mapServer.projection,
    featureProjection: projection
  };

  let result = await queryArcGISSpatial(params);
  if (result && result.data && result.data.features) {
    let info = result.data.features[0].attributes;
    let adcode = info[cities_mapServer.codeKey].toString();
    let name = info[cities_mapServer.nameKey].toString();
    return { adcode, name };
  }
  return null;
}
