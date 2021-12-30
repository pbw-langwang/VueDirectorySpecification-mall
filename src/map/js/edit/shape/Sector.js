import Shape from "./Shape";
import * as PlotUtils from "../utils/PlotUtils";

class Sector extends Shape {
  constructor() {
    super();

    this.controlSum = 3;

    this.radius = null;

    this.startAngle = null;

    this.endAngle = null;
  }

  calculate_(points) {
    let one = points[0];
    let two = points[1];
    let three = points[2];
    this.radius = PlotUtils.distance(two, one);
    this.startAngle = PlotUtils.getAzimuth(two, one);
    this.endAngle = PlotUtils.getAzimuth(three, one);
    let coordinates = PlotUtils.getArcPoints(
      one,
      this.radius,
      this.startAngle,
      this.endAngle
    );
    coordinates.push(one, coordinates[0]);

    return coordinates;
  }

  getDegree() {
    if (!this.startAngle || !this.endAngle) {
      return;
    }
    let angle = Math.abs(this.endAngle - this.startAngle);
    let degree = angle * (180 / Math.PI);

    if (this.endAngle - this.startAngle < 0) {
      degree = 360 - degree;
    }

    return degree;
  }
}

export default Sector;
