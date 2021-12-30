import Shape from "./Shape";
import * as PlotUtils from "../utils/PlotUtils";

class ArrowPolygon extends Shape {
  constructor() {
    super();

    this.controlSum = 2;

    this.tailWidthFactor = 0.1;

    this.neckWidthFactor = 0.2;

    this.headWidthFactor = 0.1 * Math.sqrt(6);

    this.headAngle = Math.PI / 4;

    this.neckAngle = Math.PI / 6;
  }

  calculate_(points) {
    let one = points[0];
    let two = points[1];
    let len = PlotUtils.getBaseLength([one, two]);
    let tailWidth = len * this.tailWidthFactor;
    let neckWidth = len * this.neckWidthFactor;
    let headWidth = len * this.headWidthFactor;
    let tailLeft = PlotUtils.getThirdPoint(
      two,
      one,
      PlotUtils.Constants.HALF_PI,
      tailWidth,
      true
    );
    let tailRight = PlotUtils.getThirdPoint(
      two,
      one,
      PlotUtils.Constants.HALF_PI,
      tailWidth,
      false
    );
    let headLeft = PlotUtils.getThirdPoint(
      one,
      two,
      this.headAngle,
      headWidth,
      false
    );
    let headRight = PlotUtils.getThirdPoint(
      one,
      two,
      this.headAngle,
      headWidth,
      true
    );
    let neckLeft = PlotUtils.getThirdPoint(
      one,
      two,
      this.neckAngle,
      neckWidth,
      false
    );
    let neckRight = PlotUtils.getThirdPoint(
      one,
      two,
      this.neckAngle,
      neckWidth,
      true
    );
    let coordinates = [
      tailLeft,
      neckLeft,
      headLeft,
      two,
      headRight,
      neckRight,
      tailRight
    ];
    return coordinates;
  }
}

export default ArrowPolygon;
