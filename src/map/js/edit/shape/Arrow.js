import Shape from "./Shape";
import * as PlotUtils from "./../utils/PlotUtils";

class ArrowLine extends Shape {
  constructor() {
    super();

    this.controlSum = 2;

    this.maxArrowLength_ = 3000000;

    this.arrowLengthScale_ = 5;

    this.angle = Math.PI / 6;
  }

  calculate_(points) {
    let one = points[0];
    let two = points[1];
    let distance = PlotUtils.distance(one, two);
    let len = distance / this.arrowLengthScale_;
    len = len > this.maxArrowLength_ ? this.maxArrowLength_ : len;
    let leftPnt = PlotUtils.getThirdPoint(one, two, this.angle, len, false);
    let rightPnt = PlotUtils.getThirdPoint(one, two, this.angle, len, true);
    let coordinates = [one, two, leftPnt, two, rightPnt];
    return coordinates;
  }
}

export default ArrowLine;
