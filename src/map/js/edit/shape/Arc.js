import Shape from "./Shape";
import * as PlotUtils from "./../utils/PlotUtils";

class Arc extends Shape {
  constructor() {
    super();

    this.controlSum = 3;
  }

  calculate_(points) {
    let one = points[0];
    let two = points[1];
    let three = points[2];
    let center = PlotUtils.getCircleCenterOfThreePoints(one, two, three);
    let radius = PlotUtils.distance(one, center);

    let angle1 = PlotUtils.getAzimuth(one, center);
    let angle2 = PlotUtils.getAzimuth(two, center);
    let startAngle;
    let endAngle;
    if (PlotUtils.isClockWise(one, two, three)) {
      startAngle = angle2;
      endAngle = angle1;
    } else {
      startAngle = angle1;
      endAngle = angle2;
    }
    let coordinates = PlotUtils.getArcPoints(
      center,
      radius,
      startAngle,
      endAngle
    );
    return coordinates;
  }
}

export default Arc;
