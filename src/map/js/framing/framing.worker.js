import { SCALE_DIFF, MILLION_ROW_CODE } from "./frameData";
import * as turf from "@turf/turf";
import booleanIntersects from "@turf/boolean-intersects";

const DEFAULT_EXTENT = [73.62, 16.7, 134.77, 53.56];

function getMapFrames({ extent, scale = "B", polygon } = {}) {
  let [minx, miny, maxx, maxy] = extent || DEFAULT_EXTENT;
  let minCol = Math.floor((minx + 180) / 6 + 1);
  let maxCol = Math.floor((maxx + 180) / 6 + 1);
  let minRow = Math.floor(Math.abs(miny) / 4);
  let maxRow = Math.floor(Math.abs(maxy) / 4);

  let polygon1 = polygon ? turf.polygon(polygon) : null;

  let frames = [];
  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minCol; j <= maxCol; j++) {
      let minLon = (j - 1) * 6 - 180;
      let minLat = i * 4;
      let scaleDiff = SCALE_DIFF[scale];
      for (let r = 0; r < scaleDiff.lenY; r++) {
        for (let c = 0; c < scaleDiff.lenX; c++) {
          let x1 = minLon + scaleDiff.dx * c;
          let y1 = minLat + scaleDiff.dy * r;
          let x2 = minLon + scaleDiff.dx * (c + 1);
          let y2 = minLat + scaleDiff.dy * (r + 1);

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
            let bool =
              turf.booleanContains(polygon1, polygon2) ||
              turf.booleanContains(polygon2, polygon1) ||
              booleanIntersects(polygon1, polygon2);
            if (!bool) {
              continue;
            }
          }

          let tfh =
            `${MILLION_ROW_CODE[i]}${padStart(j, 2)}` +
            `${scale}` +
            `${padStart(scaleDiff.lenY - r, 3)}` +
            `${padStart(c + 1, 3)}`;

          frames.push({ code: tfh, extent: min_extent });
        }
      }
    }
  }
  return frames;
}

function padStart(num, len) {
  return num.toString().padStart(len, "0");
}

onmessage = function(event) {
  let data = event.data;
  let result = getMapFrames(data);
  postMessage(result);
};
