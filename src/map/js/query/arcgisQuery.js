import Geometry from "ol/geom/Geometry";
import GeometryType from "ol/geom/GeometryType";
import EsriJSON from "ol/format/EsriJSON";
import { appendParams } from "ol/uri";
import { registerWktProj } from "../projections";

/**
 * arcgis 服务详情
 * @param {String} url
 * @param {Array(Object)}
 */
export async function getArcGISLayersInfo(url) {
  if (!url) {
    return;
  }

  const jsonUrl = appendParams(url, {
    f: "pjson"
  });

  try {
    const response = await fetch(jsonUrl);
    const data = await response.json();
    if (!data || data.error) {
      return null;
    }

    let projection = null;
    if (data.spatialReference.latestWkid || data.spatialReference.wkid) {
      projection = `EPSG:${data.spatialReference.latestWkid ||
        data.spatialReference.wkid}`;
    } else if (data.spatialReference.wkt) {
      projection = registerWktProj(data.spatialReference.wkt);
    }

    return {
      ...data,
      projection: projection
    };
  } catch {
    return null;
  }
}

/**
 * @description ObjectIDs查询
 * @param {Object} params
 * @param  {String} params.url
 * @param  {String} params.layerId
 * @param  {Object} params.params 参数为arcgis query 的参数 where:[{key,operator,value}]
 * @return
 */
export async function getArcGISObjectIDs({ url, layerId, params }) {
  if (!url || layerId == null) {
    return;
  }

  let queryUrl = url + "/" + layerId + "/query";

  let index = url.indexOf("?");
  if (index !== -1) {
    let paramString = url.substr(index + 1);
    let prefix = url.substr(0, index);
    queryUrl = prefix + "/" + layerId + "/query?" + paramString;
  }

  let where = "1=1";
  if (params && params.where) {
    let expressions = params.where.map(o => {
      return `${o.key} ${o.operator} ${o.value}`;
    });
    where = expressions.join(" and ");
  }

  let formData = new FormData();
  formData.append("f", "json");
  formData.append("where", where);
  formData.append("returnGeometry", "false");
  formData.append("returnIdsOnly", "true");

  try {
    const response = await fetch(queryUrl, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (!data || data.error) {
      return null;
    }

    return {
      count: data.objectIds.length,
      ids: data.objectIds
    };
  } catch (error) {
    return null;
  }
}

/**
 * @description 属性查询
 * @param {Object} params
 * @param  {String} params.url
 * @param  {String} params.layerId
 * @param  {Geometry} params.layerProjection 图层坐标系
 * @param  {Geometry} params.geometry
 * @param  {Object} params.params 参数为arcgis query 的参数 where:[{key,operator,value}]
 * @param {string} params.featureProjection 几何信息坐标系
 * @return
 */
export async function queryArcGISProperties({
  url,
  layerId,
  layerProjection,
  params,
  featureProjection
}) {
  if (!url || layerId == null || !layerProjection) {
    return;
  }

  let queryUrl = url + "/" + layerId + "/query";

  let index = url.indexOf("?");
  if (index !== -1) {
    let paramString = url.substr(index + 1);
    let prefix = url.substr(0, index);
    queryUrl = prefix + "/" + layerId + "/query?" + paramString;
  }

  let where = "1=1";
  if (params && params.where) {
    let expressions = params.where.map(o => {
      return `${o.key} ${o.operator} ${o.value}`;
    });
    where = expressions.join(" and ");
  }

  let formData = new FormData();
  formData.append("f", "json");
  formData.append("where", where);
  formData.append("returnGeometry", "true");
  formData.append("outFields", "*");
  formData.append("objectIds", params.objectIds || "");

  try {
    const response = await fetch(queryUrl, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (!data || data.error) {
      return null;
    }

    formData.append("where", "1=1");
    formData.append("returnGeometry", "false");
    formData.append("returnIdsOnly", "true");
    const res = await fetch(queryUrl, {
      method: "POST",
      body: formData
    });
    const result = await res.json();

    return {
      data: data,
      features: new EsriJSON().readFeatures(data, {
        dataProjection: layerProjection,
        featureProjection: featureProjection
      }),
      count: result.objectIds.length,
      ids: result.objectIds
    };
  } catch (error) {
    return null;
  }
}

/**
 * @description 空间查询
 * @param {Object} params
 * @param  {String} params.url
 * @param  {String} params.layerId
 * @param  {Geometry} params.layerProjection 图层坐标系
 * @param  {Geometry} params.geometry
 * @param  {String} params.spatialRel
 * @param {string} params.featureProjection 几何信息坐标系
 * @return
 */
export async function queryArcGISSpatial({
  url,
  layerId,
  layerProjection,
  geometry,
  spatialRel,
  featureProjection
}) {
  if (!url || layerId == null || !layerProjection || !geometry) {
    return;
  }
  let geometryType = geometry.getType();
  let geometryType_ = null;
  if (geometryType === GeometryType.POINT) {
    geometryType_ = esrGeometryType.esriGeometryPoint;
  } else if (geometryType === GeometryType.LINE_STRING) {
    geometryType_ = esrGeometryType.esriGeometryPolyline;
  } else if (geometryType === GeometryType.POLYGON) {
    geometryType_ = esrGeometryType.esriGeometryPolygon;
  } else if (geometryType === GeometryType.CIRCLE) {
    geometryType_ = esrGeometryType.esriGeometryPolygon;
  }
  let geometry_ = new EsriJSON().writeGeometry(geometry, {
    dataProjection: layerProjection,
    featureProjection: featureProjection
  });

  let spatialRel_ = spatialRel || esriSpatialRel.esriSpatialRelIntersects;

  let queryUrl = url + "/" + layerId + "/query";

  let index = url.indexOf("?");
  if (index !== -1) {
    let paramString = url.substr(index + 1);
    let prefix = url.substr(0, index);
    queryUrl = prefix + "/" + layerId + "/query?" + paramString;
  }

  let formData = new FormData();
  formData.append("f", "json");
  formData.append("geometry", geometry_);
  formData.append("geometryType", geometryType_);
  formData.append("spatialRel", spatialRel_);
  formData.append("returnGeometry", "true");
  formData.append("outFields", "*");

  try {
    const response = await fetch(queryUrl, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (!data || data.error) {
      return null;
    }
    return {
      data: data,
      features: new EsriJSON().readFeatures(data, {
        dataProjection: layerProjection,
        featureProjection: featureProjection
      })
    };
  } catch (error) {
    return null;
  }
}

/**
 * 通过url 获取图例信息
 * @param  {String} {url}
 */
export async function queryArcGISLegend({ url }) {
  if (!url) {
    return;
  }

  try {
    let index = url.indexOf("?");
    let str = "/legend";
    if (index != -1) {
      url = url.slice(0, index) + str + url.slice(index);
    } else {
      url += str;
    }

    const jsonUrl = appendParams(url, {
      f: "pjson"
    });

    const response = await fetch(jsonUrl);
    const data = await response.json();
    if (!data || data.error) {
      return null;
    }

    return data;
  } catch (error) {
    return null;
  }
}

const esrGeometryType = {
  esriGeometryPoint: "esriGeometryPoint",
  esriGeometryPolyline: "esriGeometryPolyline",
  esriGeometryPolygon: "esriGeometryPolygon",
  esriGeometryEnvelope: "esriGeometryEnvelope",
  esriGeometryMultipoint: "esriGeometryMultipoint"
};

const esriSpatialRel = {
  esriSpatialRelContains: "esriSpatialRelContains", //Part or all of a feature from feature class 1 is contained within a feature from feature class 2.
  esriSpatialRelCrosses: "esriSpatialRelCrosses", // The feature from feature class 1 crosses a feature from feature class 2.
  esriSpatialRelEnvelopeIntersects: "esriSpatialRelEnvelopeIntersects", // The envelope of feature class 1 intersects with the envelope of feature class 2.
  esriSpatialRelIndexIntersects: "esriSpatialRelIndexIntersects", // The envelope of the query feature class intersects the index entry for the target feature class.
  esriSpatialRelIntersects: "esriSpatialRelIntersects", // Part of a feature from feature class 1 is contained in a feature from feature class 2.
  esriSpatialRelOverlaps: "esriSpatialRelOverlaps", // Features from feature class 1 overlap features in feature class 2.
  esriSpatialRelRelation: "esriSpatialRelRelation", // Indicates that a spatial relationship function will be used.
  esriSpatialRelTouches: "esriSpatialRelTouches", // The feature from feature class 1 touches the border of a feature from feature class 2.
  esriSpatialRelWithin: "esriSpatialRelWithin" //：The feature from feature class 1 is completely enclosed by the feature from feature class 2.
};
