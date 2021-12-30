import Shape from "./Shape";
import * as PlotUtils from "./../utils/PlotUtils";

class Curve extends Shape {
  constructor() {
    super();

    this.controlSum = 3;

    this.curvature = 0.3;
  }

  calculate_(points) {
    let coordinates = PlotUtils.getCurvePoints(this.curvature, points);
    return coordinates;
  }
}

export default Curve;
