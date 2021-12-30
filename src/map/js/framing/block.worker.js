import * as turf from "@turf/turf";
import booleanIntersects from "@turf/boolean-intersects";

export function getBlocks({ extent, length, polygon } = {}) {
  if (!extent) {
    return;
  }
  let result = [];

  let [minx, miny, maxx, maxy] = extent;
  let col = Math.floor((maxx - minx) / length + 1);
  let row = Math.floor((maxy - miny) / length + 1);
  let polygon1 = polygon ? turf.polygon(polygon) : null;

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      let x1 = minx + j * length;
      let y1 = miny + i * length;
      let x2 = minx + (j + 1) * length;
      let y2 = miny + (i + 1) * length;

      let min_extent = [x1, y1, x2, y2];
      if (polygon1) {
        let polygon2 = turf.polygon([
          [
            [min_extent[0], min_extent[1]],
            [min_extent[2], min_extent[1]],
            [min_extent[2], min_extent[3]],
            [min_extent[0], min_extent[3]],
            [min_extent[0], min_extent[1]]
          ]
        ]);
        let bool = turf.booleanContains(polygon1, polygon2); //  ||
        // turf.booleanContains(polygon2, polygon1); // ||
        // booleanIntersects(polygon1, polygon2);
        if (!bool) {
          continue;
        }
      }

      result.push({ extent: min_extent, row: i, col: j });
    }
  }
  return result;
}

onmessage = function(event) {
  let data = event.data;
  let result = getBlocks(data);
  postMessage(result);
};
