import { appendParams } from "ol/uri";
import { transformExtent } from "ol/proj";

import { DEFAULT_PROJECTION } from "../common";
import { registerWktProj } from "../projections";

import DxXYZLayer from "./xyzLayer";
import DxArcGISImageLayer from "./arcgisImageLayer";
import ErrorMonitor from "./../error";

/**
 * @typedef {Object} Options
 * @property {string} url - ArcGIS Serve发布的地图服务
 * @property {string} [layers] - 默认加载所有,可选择指定一个或多个图层(以逗号隔开)，如 "1" 或 "0,1,2"
 * @property {boolean} [crossOrigin] - 跨域，跨域访问时需配置
 * @property {Object} [layerOptions] - 用于扩展 imageOptions | tileOptions
 * @property {Object} [sourceOptions] - 用于扩展 restOption | xyzOptions
 * 根据ArcGIS发布的地图服务是否存在切片, 选中不同的扩展参数
 */

/**
 * 获取图层，图层存在，则附加defaultExtent属性，范围坐标采用全局的默认输出坐标系{@link DEFAULT_PROJECTION }
 * @param {Options} options
 * @returns layer
 */
export async function getArcGISLayer(options) {
  options = { ...options };

  if (!options.url) {
    return null;
  }

  let url = options.url;

  let info = await getLayerInfo(url);
  if (!info) {
    return null;
  }

  let layer = null;
  if (info.tileGrid) {
    let index = url.indexOf("?");
    let str = "/tile/{z}/{y}/{x}";
    if (index != -1) {
      url = url.slice(0, index) + str + url.slice(index);
    } else {
      url += str;
    }

    layer = new DxXYZLayer({
      ...options,
      url,
      projection: info.projection,
      tileGrid: info.tileGrid
    });
  } else {
    layer = new DxArcGISImageLayer({
      ...options,
      url,
      projection: info.projection
    });
  }

  // 存储默认坐标系的范围
  if (layer) {
    layer.defaultExtent = transformExtent(
      info.extent,
      info.projection,
      DEFAULT_PROJECTION
    );
  }
  return layer;
}

export async function getLayerInfo(url) {
  const jsonUrl = appendParams(url, {
    f: "pjson"
  });

  try {
    const response = await fetch(jsonUrl);
    const data = await response.json();
    if (!data || data.error) {
      return null;
    }

    // 判断是否是arcgis 返回的数据结构
    if (!data.spatialReference) {
      throw new Error(JSON.stringify(data));
      // return;
    }

    let projection = null;
    if (data.spatialReference.latestWkid) {
      projection = `EPSG:${data.spatialReference.latestWkid ||
        data.spatialReference.wkid}`;
    } else if (data.spatialReference.wkt) {
      projection = registerWktProj(data.spatialReference.wkt);
    }

    let extent = [
      data.fullExtent.xmin,
      data.fullExtent.ymin,
      data.fullExtent.xmax,
      data.fullExtent.ymax
    ];

    let tileGrid = data.tileInfo ? getTileGird(data.tileInfo) : null;

    return { projection, extent, tileGrid };
  } catch (error) {
    new ErrorMonitor(error);
    return null;
  }
}

/**
 * 根据ArcGIS 的tileInfo 数据生成tileGird对象
 * @param {Object} tileInfo - ArcGIS json 请求返回的tileInfo数据
 * @returns tileGird - {origin,tileSize,resolutions,matrixIds}
 */
function getTileGird(tileInfo) {
  if (!tileInfo) {
    return;
  }
  let resolutions = [];
  let matrixIds = [];
  const origin = [
    Number.parseFloat(tileInfo.origin.x),
    Number.parseFloat(tileInfo.origin.y)
  ];
  const tileSize = [tileInfo.cols, tileInfo.rows];
  const { lods } = tileInfo;
  for (let i = 0; i < lods.length; i += 1) {
    const element = lods[i];
    matrixIds.push(element.level);
    resolutions.push(element.resolution);
  }
  return {
    origin,
    tileSize,
    resolutions,
    matrixIds
  };
}
