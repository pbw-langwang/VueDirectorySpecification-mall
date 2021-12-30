import {
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon
} from "ol/geom";
import GeometryType from "ol/geom/GeometryType";
import { getCenter, extend } from "ol/extent";

/**
 * 根据要素获取中心点
 * @param  {import("ol/feature")} feature
 * @return center
 */
export function getCenterByFeature(feature) {
  if (!feature) {
    return;
  }

  let geometry = feature.getGeometry();
  let center = null;
  if (geometry instanceof Point) {
    center = geometry.getCoordinates();
  } else if (geometry instanceof MultiPoint) {
    center = getCenter(geometry.getExtent());
  } else if (geometry instanceof LineString) {
    let coordinates = geometry.getCoordinates();
    let length = coordinates.length;
    if (length % 2) {
      let one = coordinates[length / 2 - 1];
      let two = coordinates[length / 2];
      center = [one[0] + (two[0] - one[0]) / 2, one[1] + (two[1] - one[1]) / 2];
    } else {
      center = coordinates[Math.floor(coordinates / 2)];
    }
  } else if (geometry instanceof MultiLineString) {
    center = getCenter(geometry.getExtent());
  } else if (geometry instanceof Polygon) {
    center = geometry.getInteriorPoint().getCoordinates();
  } else if (geometry instanceof MultiPolygon) {
    center = getCenter(geometry.getExtent());
  }
  return center;
}

/**
 * 根据参数生成ol/geometry
 * @param  {object} param
 * @param  {string} param.type
 * @param  {array} param.coordinates
 * @returns geometry
 */
export function getGeometry({ type, coordinates }) {
  if (!type || !coordinates) {
    return;
  }

  let geometry = null;
  switch (type) {
    case GeometryType.POINT:
      geometry = new Point(coordinates);
      break;
    case GeometryType.LINE_STRING:
      geometry = new LineString(coordinates);
      break;
    case GeometryType.POLYGON:
      geometry = new Polygon(coordinates);
      break;
    case GeometryType.MULTI_POINT:
      geometry = new MultiPoint(coordinates);
      break;
    case GeometryType.MULTI_LINE_STRING:
      geometry = new MultiLineString(coordinates);
      break;
    case GeometryType.MULTI_POLYGON:
      geometry = new MultiPolygon(coordinates);
      break;
    default:
      break;
  }
  return geometry;
}

export function getFeaturesExtent(features) {
  if (!Array.isArray(features)) {
    return;
  }

  let maxExtent = null;

  features.forEach(f => {
    let extent = f.getGeometry().getExtent();
    if (maxExtent) {
      maxExtent = extend(maxExtent, extent);
    } else {
      maxExtent = extent;
    }
  });

  return maxExtent;
}

export function getFeaturesCenter(features) {
  let extent = getFeaturesExtent(features);
  if (extent) {
    return getCenter(extent);
  }
  return null;
}