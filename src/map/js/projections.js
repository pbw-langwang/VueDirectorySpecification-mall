import { register } from "ol/proj/proj4.js";
import proj4 from "proj4";
import EPSG from "./project/epsgEnum";
import Projection from "ol/proj/Projection";
import { addProjection } from "ol/proj";
import wktParser from "wkt-parser";

let wktList = new Set();

export function registerProj() {
  if (EPSG) {
    for (const key in EPSG) {
      if (Object.hasOwnProperty.call(EPSG, key)) {
        proj4.defs(`EPSG:${key}`, EPSG[key]);
      }
    }
  }
  register(proj4);

  let projection_4490 = new Projection({
    code: "EPSG:4490", // require
    units: "degree", // require
    axisOrientation: "neu",
    metersPerUnit: (Math.PI * 6378137) / 180, // require
    global: false
  });
  addProjection(projection_4490);
}

export function registerWktProj(wktString) {
  if (!wktString) {
    return;
  }
  let obj = wktParser(wktString);
  let name = obj.name;

  if (!wktList.has(name)) {
    proj4.defs(name, wktString);
    register(proj4);
  }
  return name;
}
