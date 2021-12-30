/**
 * 根据范围，计算像素宽高
 * @param  {Map} map
 * @param  {Array[x1,y1,x2,y2]} extent
 * @returns {width, height}
 */
export function getWidthAndHeightPixelByExtent(map, extent) {
  let p1 = map.getPixelFromCoordinate([extent[0], extent[1]]);
  let p2 = map.getPixelFromCoordinate([extent[2], extent[1]]);
  let p3 = map.getPixelFromCoordinate([extent[0], extent[3]]);
  let center = map.getPixelFromCoordinate([
    (extent[0] + extent[2]) / 2,
    (extent[1] + extent[3]) / 2,
  ]);

  let width = Math.abs(p1[0] - p2[0]);
  let height = Math.abs(p1[1] - p3[1]);
  return { width, height, center };
}
