import { Feature } from "ol";
import { Point, LineString, Polygon, Circle } from "ol/geom";
import { DrawType } from "./drawClass";

class controlPointsFeature extends Feature {
  constructor(feature) {
    super();

    if (feature && feature instanceof Feature) {
      this.feature = feature;
    } else {
      throw new Error("传入的不是要素对象！");
    }

    this.controlPoints = [];
    this.generateControlPoints();
  }

  getFeature() {
    return this.feature;
  }

  getPoints() {
    return this.controlPoints;
  }

  updatePoints(points) {
    this.controlPoints = points;
    this.updateControlPoints(this.controlPoints);
  }

  updatePoint(point, index) {
    this.controlPoints[index] = point;
    this.updateControlPoints(this.controlPoints);
  }

  generateControlPoints() {
    let geometry = this.feature.getGeometry();

    if (geometry instanceof Point) {
      this.controlPoints = [geometry.getCoordinates()];
    } else if (geometry instanceof LineString) {
      this.controlPoints = geometry.getCoordinates();
    } else if (geometry instanceof Circle) {
      let center = geometry.getCenter();
      let radius = geometry.getRadius();
      let another = [center[0] + radius, center[1]];
      this.controlPoints = [center, another];
    } else if (geometry instanceof Polygon) {
      let coordinates = geometry.getCoordinates()[0]; // 取外环坐标
      let type = geometry.drawType;
      // 对矩形（方形）做特殊处理
      if (type === DrawType.BOX) {
        let extent = geometry.getExtent();
        let first = [extent[0], extent[1]];
        let second = [extent[2], extent[3]];
        coordinates = [first, second];
      } else if (type === DrawType.SQUARE) {
        // todo:方形矩形的修改
      } else {
        coordinates.pop(); // 移除闭合后的最后一个坐标
      }
      this.controlPoints = coordinates;
    }
  }

  updateControlPoints(controlPoints) {
    let geometry = this.feature.getGeometry();
    if (geometry instanceof Point) {
      geometry.setCoordinates(controlPoints[0]);
    } else if (geometry instanceof LineString) {
      geometry.setCoordinates(controlPoints);
    } else if (geometry instanceof Circle) {
      let center = controlPoints[0];
      let another = controlPoints[1];
      let radius = Math.sqrt(
        Math.pow(center[0] - another[0], 2) +
          Math.pow(center[1] - another[1], 2)
      );
      geometry.setCenterAndRadius(center, radius);
    } else if (geometry instanceof Polygon) {
      let type = geometry.drawType;
      if (type === DrawType.BOX) {
        let first = controlPoints[0];
        let second = controlPoints[1];
        let c = [
          [first, [first[0], second[1]], second, [second[0], first[1]], first],
        ];
        geometry.setCoordinates(c);
      } else if (type === DrawType.SQUARE) {
        // todo:方形矩形的修改
      } else {
        let coordinates = [[...controlPoints, controlPoints[0]]];
        geometry.setCoordinates(coordinates);
      }
    }

    if (this.feature.updateStyle) {
      this.feature.updateStyle(this.feature);
    }
  }
}

export default controlPointsFeature;
