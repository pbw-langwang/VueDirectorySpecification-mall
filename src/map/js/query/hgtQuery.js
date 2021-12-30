import { appendParams } from "ol/uri";
import EsriJSON from "ol/format/EsriJSON";
import GeometryType from "ol/geom/GeometryType";

export function getHgtLayersInfo({ layerId, name }) {
  if (layerId == null) {
    return;
  }

  return {
    layers: [
      {
        id: layerId,
        name: name,
        parentLayerId: -1
      }
    ],
    projection: "EPSG:4326"
  };
}

export async function queryHgtProperties({
  prefixUrl,
  dataType,
  layerId,
  layerProjection,
  params,
  featureProjection
}) {
  if (!prefixUrl || layerId == null) {
    return;
  }

  let url = `${prefixUrl}/DataShareService/GetLayerFeatureInfo`;

  let queryUrl = appendParams(url, {
    layerid: layerId,
    dataType: dataType,
    pagesize: params ? params.pageSize : 10,
    pageNo: params ? params.pageIndex : 1
  });

  try {
    const response = await fetch(queryUrl);
    const data = await response.json();
    if (!data || data.status === "error") {
      return null;
    }


    let esriJSON = transformEsriJSON(data.result);

    return {
      data: esriJSON,
      features:new EsriJSON().readFeatures(esriJSON, {
        dataProjection: layerProjection,
        featureProjection: featureProjection
      }),
      count: data.result.FeatureCounts
    };
  } catch (error) {
    return null;
  }
}

function transformEsriJSON(hgtData) {
  if (!hgtData) {
    return null;
  }

  let geometryType = hgtData.esriGeometryType;
  let fieldAliases = {};
  if (Array.isArray(hgtData.lstFldName)) {
    hgtData.lstFldName.forEach(x => {
      if (x !== "SHAPE") {
        fieldAliases[x] = x;
      }
    });
  }

  let features = [];
  if (Array.isArray(hgtData.lstVal)) {
    hgtData.lstVal.forEach(x => {
      let attributes = {};
      let geometry = {};
      x.lstFldVal.forEach(y => {
        if (y.key == "SHAPE") {
          geometry = JSON.parse(y.value);
        } else {
          attributes[y.key] = y.value;
        }
      });
      features.push({ attributes, geometry });
    });
  }

  let esriJSON = {
    displayFieldName: "OBJECTID",
    geometryType: geometryType,
    fieldAliases: fieldAliases,
    features: features,
    spatialReference: { wkid: 4326, latestWkid: 4326 }
  };
  return esriJSON;
}

export async function queryHgtSpatial({
  prefixUrl,
  dataType,
  layerId,
  layerProjection,
  geometry,
  spatialRel,
  featureProjection
}) {
  if (!prefixUrl || layerId == null || !geometry) {
    return;
  }

  let url = `${prefixUrl}/DataShareService/FeatureInfoBySelect`;

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
  let geometry_ = new EsriJSON().writeGeometryObject(geometry, {
    dataProjection: layerProjection,
    featureProjection: featureProjection
  });
  geometry_.spatialReference = { wkid: 4326, latestWkid: 4326 };
  geometry_ = JSON.stringify(geometry_);


  let spatialRel_ = spatialRel || esriSpatialRel.esriSpatialRelIntersects;

  // let formData = new FormData();
  // formData.append("layerid", layerId);
  // formData.append("zbjson", geometry_);
  // formData.append("esritype", geometryType_);
  // formData.append("spatialRel", spatialRel_);

  let params = {
    layerid:layerId,
    zbjson:geometry_,
    esritype:geometryType_,
    spatialRel:spatialRel_
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(params)
    });
    const data = await response.json();
    if (!data || data.error) {
      return null;
    }

    let esriJSON = transformEsriJSON(data.result);
    return {
      data: esriJSON,
      features: new EsriJSON().readFeatures(esriJSON, {
        dataProjection: layerProjection,
        featureProjection: featureProjection
      })
    };
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
