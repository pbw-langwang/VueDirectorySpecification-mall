import Shape from "./Shape";
import * as PlotUtils from "../utils/PlotUtils";

class DoubleArrow extends Shape {
  constructor() {
    super();

    this.controlSum = 4;

    this.headHeightFactor = 0.25;

    this.headWidthFactor = 0.3;

    this.neckHeightFactor = 0.85;

    this.neckWidthFactor = 0.15;

    this.connPoint_ = null;

    this.tempPoint4_ = null;
  }

  calculate_(points) {

    let pnt1 = points[0];
    let pnt2 = points[1];
    let pnt3 = points[2];
    let count = points.length;
    if (count == 3) {
      this.tempPoint4_ = this.getTempPoint4(pnt1, pnt2, pnt3);
    } else {
      this.tempPoint4_ = points[3];
    }
    if (count == 3 || count == 4) {
      this.connPoint_ = PlotUtils.mid(pnt1, pnt2);
    } else {
      this.connPoint_ = points[4];
    }
    let leftArrowPnts, rightArrowPnts;
    if (PlotUtils.isClockWise(pnt1, pnt2, pnt3)) {
      leftArrowPnts = this.getArrowPoints(
        pnt1,
        this.connPoint_,
        this.tempPoint4_,
        false
      );
      rightArrowPnts = this.getArrowPoints(this.connPoint_, pnt2, pnt3, true);
    } else {
      leftArrowPnts = this.getArrowPoints(pnt2, this.connPoint_, pnt3, false);
      rightArrowPnts = this.getArrowPoints(
        this.connPoint_,
        pnt1,
        this.tempPoint4_,
        true
      );
    }
    let m = leftArrowPnts.length;
    let t = (m - 5) / 2;

    let llBodyPnts = leftArrowPnts.slice(0, t);
    let lArrowPnts = leftArrowPnts.slice(t, t + 5);
    let lrBodyPnts = leftArrowPnts.slice(t + 5, m);

    let rlBodyPnts = rightArrowPnts.slice(0, t);
    let rArrowPnts = rightArrowPnts.slice(t, t + 5);
    let rrBodyPnts = rightArrowPnts.slice(t + 5, m);

    rlBodyPnts = PlotUtils.getBezierPoints(rlBodyPnts);
    let bodyPnts = PlotUtils.getBezierPoints(
      rrBodyPnts.concat(llBodyPnts.slice(1))
    );
    lrBodyPnts = PlotUtils.getBezierPoints(lrBodyPnts);

    let coordinates = rlBodyPnts.concat(rArrowPnts, bodyPnts, lArrowPnts, lrBodyPnts);
    return coordinates;
  }

  getArrowPoints(pnt1, pnt2, pnt3, clockWise) {
    let midPnt = PlotUtils.mid(pnt1, pnt2);
    let len = PlotUtils.distance(midPnt, pnt3);
    let midPnt1 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.3, true);
    let midPnt2 = PlotUtils.getThirdPoint(pnt3, midPnt, 0, len * 0.5, true);
    midPnt1 = PlotUtils.getThirdPoint(
      midPnt,
      midPnt1,
      PlotUtils.Constants.HALF_PI,
      len / 5,
      clockWise
    );
    midPnt2 = PlotUtils.getThirdPoint(
      midPnt,
      midPnt2,
      PlotUtils.Constants.HALF_PI,
      len / 4,
      clockWise
    );

    let points = [midPnt, midPnt1, midPnt2, pnt3];
    // 计算箭头部分
    let arrowPnts = this.getArrowHeadPoints(points);
    let neckLeftPoint = arrowPnts[0];
    let neckRightPoint = arrowPnts[4];
    // 计算箭身部分
    let tailWidthFactor =
      PlotUtils.distance(pnt1, pnt2) / PlotUtils.getBaseLength(points) / 2;
    let bodyPnts = this.getArrowBodyPoints(
      points,
      neckLeftPoint,
      neckRightPoint,
      tailWidthFactor
    );
    let n = bodyPnts.length;
    let lPoints = bodyPnts.slice(0, n / 2);
    let rPoints = bodyPnts.slice(n / 2, n);
    lPoints.push(neckLeftPoint);
    rPoints.push(neckRightPoint);
    lPoints = lPoints.reverse();
    lPoints.push(pnt2);
    rPoints = rPoints.reverse();
    rPoints.push(pnt1);
    return lPoints.reverse().concat(arrowPnts, rPoints);
  }

  getArrowHeadPoints(points) {
    let len = PlotUtils.getBaseLength(points);
    let headHeight = len * this.headHeightFactor;
    let headPnt = points[points.length - 1];
    let headWidth = headHeight * this.headWidthFactor;
    let neckWidth = headHeight * this.neckWidthFactor;
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
      leftBodyPnts = [],
      rightBodyPnts = [];
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
      leftBodyPnts.push(left);
      rightBodyPnts.push(right);
    }
    return leftBodyPnts.concat(rightBodyPnts);
  }

  // 计算对称点
  getTempPoint4(linePnt1, linePnt2, point) {
    let midPnt = PlotUtils.mid(linePnt1, linePnt2);
    let len = PlotUtils.distance(midPnt, point);
    let angle = PlotUtils.getAngleOfThreePoints(linePnt1, midPnt, point);
    let symPnt, distance1, distance2, mid;
    if (angle < PlotUtils.Constants.HALF_PI) {
      distance1 = len * Math.sin(angle);
      distance2 = len * Math.cos(angle);
      mid = PlotUtils.getThirdPoint(
        linePnt1,
        midPnt,
        PlotUtils.Constants.HALF_PI,
        distance1,
        false
      );
      symPnt = PlotUtils.getThirdPoint(
        midPnt,
        mid,
        PlotUtils.Constants.HALF_PI,
        distance2,
        true
      );
    } else if (angle >= PlotUtils.Constants.HALF_PI && angle < Math.PI) {
      distance1 = len * Math.sin(Math.PI - angle);
      distance2 = len * Math.cos(Math.PI - angle);
      mid = PlotUtils.getThirdPoint(
        linePnt1,
        midPnt,
        PlotUtils.Constants.HALF_PI,
        distance1,
        false
      );
      symPnt = PlotUtils.getThirdPoint(
        midPnt,
        mid,
        PlotUtils.Constants.HALF_PI,
        distance2,
        false
      );
    } else if (angle >= Math.PI && angle < Math.PI * 1.5) {
      distance1 = len * Math.sin(angle - Math.PI);
      distance2 = len * Math.cos(angle - Math.PI);
      mid = PlotUtils.getThirdPoint(
        linePnt1,
        midPnt,
        PlotUtils.Constants.HALF_PI,
        distance1,
        true
      );
      symPnt = PlotUtils.getThirdPoint(
        midPnt,
        mid,
        PlotUtils.Constants.HALF_PI,
        distance2,
        true
      );
    } else {
      distance1 = len * Math.sin(Math.PI * 2 - angle);
      distance2 = len * Math.cos(Math.PI * 2 - angle);
      mid = PlotUtils.getThirdPoint(
        linePnt1,
        midPnt,
        PlotUtils.Constants.HALF_PI,
        distance1,
        true
      );
      symPnt = PlotUtils.getThirdPoint(
        midPnt,
        mid,
        PlotUtils.Constants.HALF_PI,
        distance2,
        false
      );
    }
    return symPnt;
  }
}

export default DoubleArrow;
