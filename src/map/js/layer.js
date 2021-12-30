import { getArcGISLayer } from "./layer/arcgisLayer";
import { getGeoServerLayer } from "./layer/geoserverLayer";
import DxXYZLayer from "./layer/xyzLayer";
import DxWMSLayer from "./layer/wmsLayer";
import DxStamenLayer from "./layer/stamenLayer";

export { default as DxVectorLayer } from "./layer/vectorLayer";

/**
 * 生成栅格图层
 * @param {Object} params
 * @param {string} params.type - "arcgis" | "arcgisserver" | "geoserver" | "xyz" | "wms" | "stamen"
 * @param {string} params.url - 地图服务
 * @param {...*} params.options - 其他参数，不同的类型对应不同的参数
 * @return layer
 */
export async function getImageLayer({ type, url, ...options }) {
  let layer = null;

  if (!type) {
    return;
  }

  type = type.toLowerCase();

  if (type === "stamen") {
    layer = new DxStamenLayer(options);
    return layer;
  }

  options = { url, ...options };

  switch (type) {
    case "arcgis":
    case "arcgisserver":
      layer = await getArcGISLayer(options);
      break;
    case "geoserver":
      layer = await getGeoServerLayer(options);
      break;
    case "xyz":
      layer = new DxXYZLayer(options);
      break;
    case "wms":
      layer = new DxWMSLayer(options);
      break;
    case "hgt":
      layer = new DxWMSLayer(options);
      break;
    default:
      break;
  }
  return layer;
}
