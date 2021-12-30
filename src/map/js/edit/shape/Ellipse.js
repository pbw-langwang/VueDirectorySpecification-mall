import Shape from "./Shape";
import * as PlotUtils from "./../utils/PlotUtils";
import { calculateCirclePoints } from "../../math";

class Ellipse extends Shape {
  constructor() {
    super();

    this.controlSum = 3;
  }

  calculate_(points){
    let center = points[0];
    let two = points[1];
    let three = points[2];
    let longAxisRadius = PlotUtils.distance(center, two);
    let shortAxisRadius =  PlotUtils.distance(two, three);
    let coordinates = calculateCirclePoints(center, two, longAxisRadius, shortAxisRadius);
    return coordinates;
  }
}

export default Ellipse;
