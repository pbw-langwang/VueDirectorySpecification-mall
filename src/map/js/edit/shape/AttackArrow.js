import Shape from "./Shape";
import * as PlotUtils from "../utils/PlotUtils";

class AttackArrow extends Shape {
  constructor() {
    super();

    this.controlSum = 4;

    this.headHeightFactor = 0.18;

    this.headWidthFactor = 0.3;

    this.neckHeightFactor = 0.85;

    this.neckWidthFactor = 0.15;

    this.headTailFactor = 0.8;
  }

  calculate_(points) {
    // 计算箭尾
    let tailLeft = points[0];
    let tailRight = points[1];
    if (PlotUtils.isClockWise(points[0], points[1], points[2])) {
      tailLeft = points[1];
      tailRight = points[0];
    }
    let midTail = PlotUtils.mid(tailLeft, tailRight);
    let bonePoints = [midTail].concat(points.slice(2));
    // 计算箭头
    let headPoints = this.getArrowheadPoints(bonePoints, tailLeft, tailRight);
    let neckLeft = headPoints[0];
    let neckRight = headPoints[4];
    let tailWidthFactor =
      PlotUtils.distance(tailLeft, tailRight) /
      PlotUtils.getBaseLength(bonePoints);
    // 计算箭身
    let bodyPoints = this.getArrowBodyPoints(
      bonePoints,
      neckLeft,
      neckRight,
      tailWidthFactor
    );
    // 整合
    let count = bodyPoints.length;
    let leftPoints = [tailLeft].concat(bodyPoints.slice(0, count / 2));
    leftPoints.push(neckLeft);
    let rightPoints = [tailRight].concat(bodyPoints.slice(count / 2, count));
    rightPoints.push(neckRight);

    leftPoints = PlotUtils.getQBSplinePoints(leftPoints);
    rightPoints = PlotUtils.getQBSplinePoints(rightPoints);
    let coordinates = leftPoints.concat(headPoints, rightPoints.reverse());
    return coordinates;
  }

  getArrowheadPoints(points, tailLeft, tailRight) {
    let len = PlotUtils.getBaseLength(points);
    let headHeight = len * this.headHeightFactor;
    let headPnt = points[points.length - 1];
    len = PlotUtils.distance(headPnt, points[points.length - 2]);
    let tailWidth = PlotUtils.distance(tailLeft, tailRight);
    if (headHeight > tailWidth * this.headTailFactor) {
      headHeight = tailWidth * this.headTailFactor;
    }
    let headWidth = headHeight * this.headWidthFactor;
    let neckWidth = headHeight * this.neckWidthFactor;
    headHeight = headHeight > len ? len : headHeight;
    let neckHeight = headHeight * this.neckHeightFactor;
    let headEndPnt = PlotUtils.getThirdPoint(
      points[points.length - 2],
      headPnt,
      0,
      headHeight,
      true
    );
    let neckEndPnt = PlotUtils.getThirdPoint(
      points[points.length - 2],
      headPnt,
      0,
      neckHeight,
      true
    );
    let headLeft = PlotUtils.getThirdPoint(
      headPnt,
      headEndPnt,
      PlotUtils.Constants.HALF_PI,
      headWidth,
      false
    );
    let headRight = PlotUtils.getThirdPoint(
      headPnt,
      headEndPnt,
      PlotUtils.Constants.HALF_PI,
      headWidth,
      true
    );
    let neckLeft = PlotUtils.getThirdPoint(
      headPnt,
      neckEndPnt,
      PlotUtils.Constants.HALF_PI,
      neckWidth,
      false
    );
    let neckRight = PlotUtils.getThirdPoint(
      headPnt,
      neckEndPnt,
      PlotUtils.Constants.HALF_PI,
      neckWidth,
      true
    );
    return [neckLeft, headLeft, headPnt, headRight, neckRight];
  }

  getArrowBodyPoints(points, neckLeft, neckRight, tailWidthFactor) {
    let allLen = PlotUtils.wholeDistance(points);
    let len = PlotUtils.getBaseLength(points);
    let tailWidth = len * tailWidthFactor;
    let neckWidth = PlotUtils.distance(neckLeft, neckRight);
    let widthDif = (tailWidth - neckWidth) / 2;
    let tempLen = 0,
      leftBodyPoints = [],
      rightBodyPoints = [];
    for (let i = 1; i < points.length - 1; i++) {
      let angle =
        PlotUtils.getAngleOfThreePoints(
          points[i - 1],
          points[i],
          points[i + 1]
        ) / 2;
      tempLen += PlotUtils.distance(points[i - 1], points[i]);
      let w = (tailWidth / 2 - (tempLen / allLen) * widthDif) / Math.sin(angle);
      let left = PlotUtils.getThirdPoint(
        points[i - 1],
        points[i],
        Math.PI - angle,
        w,
        true
      );
      let right = PlotUtils.getThirdPoint(
        points[i - 1],
        points[i],
        angle,
        w,
        false
      );
      leftBodyPoints.push(left);
      rightBodyPoints.push(right);
    }
    return leftBodyPoints.concat(rightBodyPoints);
  }
}

export default AttackArrow;
