// npm install @turf/turf 或  npm install @turf/buffer
import buffer from "@turf/buffer";
import GeoJSON from "ol/format/GeoJSON";

import { DEFAULT_PROJECTION } from "../common";

export const UNIT = {
  kilometers: "kilometers",
  degrees: "degrees"
};

/**
 * 根据要素对象生成缓存区要素
 * @param {object} param
 * @param {import("ol/Feature")} param.feature
 * @param {number} param.radius
 * @param {string} [param.unit] = "kilometers"
 * @param {number} [param.steps] = 8
 * @param {string} [inputProjection] = DEFAULT_PROJECTION
 * @param {string} [outputProjection] = DEFAULT_PROJECTION
 * @returns feature object
 */
export function getBufferFeatureByFeature({
  feature,
  radius,
  unit,
  steps,
  inputProjection = DEFAULT_PROJECTION,
  outputProjection = DEFAULT_PROJECTION
}) {
  if (!feature && !radius) {
    return;
  }

  let object = new GeoJSON().writeFeatureObject(feature, {
    dataProjection: "EPSG:4326",
    featureProjection: inputProjection,
  });

  return getBufferFeatureByGeoJSON({
    geojson: object,
    radius,
    unit,
    steps,
    outputProjection
  });
}

/**
 * 根据geojson 对象生成缓存区要素
 * @param {object} param
 * @param {(FeatureCollection|Geometry|Feature)} param.geojson 坐标系为经纬度坐标系WGS84
 * @param {number} param.radius
 * @param {string} [param.unit] = "kilometers"
 * @param {number} [param.steps] = 8
 * @param {string} [outputProjection] = DEFAULT_PROJECTION
 * @returns feature object
 */
export function getBufferFeatureByGeoJSON({
  geojson,
  radius,
  unit = "kilometers",
  steps = 8,
  outputProjection = DEFAULT_PROJECTION
}) {
  if (!geojson && !radius) {
    return;
  }

  let buffered = buffer(geojson, radius, { units: unit, steps });

  let resultFeature = new GeoJSON().readFeature(buffered, {
    dataProjection: "EPSG:4326",
    featureProjection: outputProjection
  });
  return resultFeature;
}
