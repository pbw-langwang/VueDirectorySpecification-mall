import Feature from "ol/Feature";
import Circle from "ol/geom/Circle";
import { transform } from "ol/proj.js";
import { DEFAULT_PROJECTION } from "./common";

/**
 * @param  {Object} map
 * @param  {import("ol/coordinate")} center 坐标，同map坐标系
 * @param  {Number} radius 半径，单位m
 */
export function createCircle(map, center, radius) {
  let projection = map.getView().getProjection();
  center = transform(center, DEFAULT_PROJECTION, projection);
  let radius_temp = transform([radius, 0], "EPSG:3857", projection);
  radius = radius_temp[0];
  return new Feature({
    geometry: new Circle(center, radius),
  });
}
