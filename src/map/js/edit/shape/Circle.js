import Shape from "./Shape";
import * as PlotUtils from "./../utils/PlotUtils";
import { calculateCirclePoints } from "../../math";

class Circle extends Shape {
  constructor() {
    super();

    this.controlSum = 2;
  }

  calculate_(points){
    let center = points[0];
    let end = points[1];
    let radius = PlotUtils.distance(center, end);
    let coordinates = calculateCirclePoints(center, end, radius, radius);
    return coordinates;
  }
}

export default Circle;
