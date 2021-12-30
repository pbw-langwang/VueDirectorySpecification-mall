import {
  getArcGISLayersInfo,
  queryArcGISSpatial,
  getArcGISObjectIDs,
  queryArcGISProperties,
  queryArcGISLegend
} from "./arcgisQuery";

import {
  getHgtLayersInfo,
  queryHgtProperties,
  queryHgtSpatial
} from "./hgtQuery";

export async function getLayerInfo({ type, url, ...options }) {
  if (!type) {
    return;
  }

  type = type.toLowerCase();

  let info = null;

  switch (type) {
    case "arcgis":
    case "arcgisserver":
      info = await getArcGISLayersInfo(url);
      break;
    case "hgt":
      info = getHgtLayersInfo({
        layerId: options ? options.layerId : null,
        name: options ? options.name : null
      });
      break;
    default:
      break;
  }
  return info;
}

export async function spatialQuery({
  layer,
  layerId,
  layerProjection,
  feature,
  featureProjection
}) {
  if (!layer || !layer.type) {
    return;
  }

  let type = layer.type.toLowerCase();

  let res, alias, list;

  if (type === "arcgis" || type === "arcgisserver") {
    if (!layer.url) {
      return;
    }

    let params = {
      url: layer.url,
      layerId: layerId,
      layerProjection: layerProjection,
      geometry: feature.getGeometry(),
      featureProjection: featureProjection
    };
    res = await queryArcGISSpatial(params);
    if (res) {
      alias = res.data.fieldAliases;
      list = res.data.features.map((x, i) => {
        return { ...x.attributes, feature: res.features[i] };
      });
      return { alias, list, features: res.features };
    }
  } else if (type === "hgt") {
    let params = {
      prefixUrl: layer.prefixUrl,
      dataType: layer.dataType,
      layerId: layerId,
      layerProjection: layerProjection,
      geometry: feature.getGeometry(),
      featureProjection: featureProjection
    };
    res = await queryHgtSpatial(params);
    if (res) {
      alias = res.data.fieldAliases;
      list = res.data.features.map((x, i) => {
        return { ...x.attributes, feature: res.features[i] };
      });
      return { alias, list, features: res.features };
    }
  }
  return;
}

export async function propertiesQuery({
  layer,
  layerId,
  layerProjection,
  params,
  featureProjection
}) {
  if (!layer || !layer.type) {
    return;
  }

  let type = layer.type.toLowerCase();

  let res, alias, list, sum;

  if (type === "arcgis" || type === "arcgisserver") {
    if (!layer.url) {
      return;
    }

    params = params ? params : {};

    let idsData = null;
    if (params.pageSize && params.pageIndex) {
      // 根据objectIDs分页
      idsData = await getArcGISObjectIDs({
        url: layer.url,
        layerId: layerId,
        params: params
      });

      let pageIndex = params.pageIndex;
      let pageSize = params.pageSize;
      let start = (pageIndex - 1) * pageSize;
      let end = pageIndex * pageSize;
      if (idsData) {
        params.objectIds = idsData.ids.slice(start, end).join(",");
      }
    }

    let options = {
      url: layer.url,
      layerId: layerId,
      layerProjection: layerProjection,
      params: params,
      featureProjection: featureProjection
    };
    res = await queryArcGISProperties(options);
    if (res) {
      alias = res.data.fieldAliases;
      list = res.data.features.map((x, i) => {
        return { ...x.attributes, feature: res.features[i] };
      });
      sum = idsData ? idsData.count : res.features.length;
      return { alias, list, sum, features: res.features };
    }
  } else if (type === "hgt") {
    let options = {
      prefixUrl: layer.prefixUrl,
      dataType: layer.dataType,
      layerId: layerId,
      layerProjection: layerProjection,
      params: params,
      featureProjection: featureProjection
    };
    res = await queryHgtProperties(options);
    if (res) {
      alias = res.data.fieldAliases;
      list = res.data.features.map((x, i) => {
        return { ...x.attributes, feature: res.features[i] };
      });
      sum = res.count;
      return { alias, list, sum, features: res.features };
    }
  }
  return;
}

export async function getLegend({ type, url, ...options }) {
  if (!type) {
    return;
  }

  type = type.toLowerCase();

  let info = null;

  switch (type) {
    case "arcgis":
    case "arcgisserver":
      info = await queryArcGISLegend({ url });
      break;
    case "hgt":
      break;
    default:
      break;
  }
  return info;
}
