import GeometryType from "ol/geom/GeometryType";
import { getDistance } from "ol/sphere";

export function getPointsByFeature(feature) {
  if (!feature) {
    return [];
  }

  let result = [];

  let geometry = feature.getGeometry();
  let coordinates = geometry.getCoordinates();
  let type = geometry.getType();
  switch (type) {
    case GeometryType.POINT:
      result = [
        {
          row: null,
          col: null,
          coordinate: coordinates
        }
      ];
      break;
    case GeometryType.MULTI_POINT:
    case GeometryType.LINE_STRING:
      result = coordinates.map((x, i) => {
        return {
          row: 0,
          col: i,
          coordinate: x
        };
      });
      break;
    case GeometryType.MULTI_LINE_STRING:
    case GeometryType.POLYGON:
      coordinates.forEach((x, i) => {
        x.forEach((y, j) => {
          result.push({
            row: i,
            col: j,
            coordinate: y
          });
        });
      });
      break;
    case GeometryType.MULTI_POLYGON:
      coordinates.forEach((x, l) => {
        x.forEach((y, i) => {
          y.forEach((z, j) => {
            result.push({
              level: l,
              row: i,
              col: j,
              coordinate: z
            });
          });
        });
      });
      break;
    case GeometryType.CIRCLE:
      result = [
        {
          row: null,
          col: null,
          coordinate: geometry.getFirstCoordinate()
        }
      ];
      break;
    default:
      break;
  }
  return result;
}

export function updateFeature(feature, data) {
  let geometry = feature.getGeometry();
  let coordinates = geometry.getCoordinates();
  let type = geometry.getType();

  let radius = null;

  switch (type) {
    case GeometryType.POINT:
      coordinates = data.coordinate;
      geometry.setCoordinates(coordinates);
      break;
    case GeometryType.MULTI_POINT:
    case GeometryType.LINE_STRING:
      coordinates[data.col] = data.coordinate;
      geometry.setCoordinates(coordinates);
      break;
    case GeometryType.MULTI_LINE_STRING:
    case GeometryType.POLYGON:
      coordinates[data.row][data.col] = data.coordinate;
      geometry.setCoordinates(coordinates);
      break;
    case GeometryType.MULTI_POLYGON:
      coordinates[data.level][data.row][data.col] = data.coordinate;
      geometry.setCoordinates(coordinates);
      break;
    case GeometryType.CIRCLE:
      radius = getDistance(geometry.getCenter(), data.coordinate);
      geometry.setRadius(radius);
      break;
    default:
      break;
  }
}


