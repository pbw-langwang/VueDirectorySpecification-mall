import LineString from "ol/geom/LineString.js";
import Polygon from "ol/geom/Polygon.js";
import GeometryType from "ol/geom/GeometryType";

class Shape {
  constructor() {
    this.shapeType = null;

    this.controlSum = 0;
  }

  create(shapeType, opt_type) {
    this.shapeType = shapeType;
    return (coordinates, opt_geometry, projection) => {
      return this.create_(coordinates, opt_geometry, opt_type, projection);
    };
  }

  create_(coordinates, opt_geometry, opt_type, projection) {
    let newCoordinates = null;
    let calcCoordinates = null;
    coordinates =
      opt_type === GeometryType.POLYGON ? coordinates[0] : coordinates;
    if (coordinates.length < this.controlSum) {
      newCoordinates = coordinates;
    } else {
      let points = [];
      for (let i = 0; i < this.controlSum; i++) {
        if (i === this.controlSum - 1) {
          points.push(coordinates[coordinates.length - 1]);
        } else {
          points.push(coordinates[i]);
        }
      }

      let result = this.calculate(points);
      newCoordinates = result.coordinates;
      calcCoordinates = result.calcCoordinates;
    }

    let geometry = this.getGeometryByCoordinates(
      newCoordinates,
      opt_type,
      opt_geometry,
      calcCoordinates
    );

    return geometry;
  }

  update(geometry, index, coordinate) {
    let calcCoordinates = geometry.get("calcCoordinates");
    let coordinates = calcCoordinates.map(x => {
      return x.coordinate;
    });

    coordinates[index] = coordinate;

    let result = this.calculate(coordinates);
    coordinates = result.coordinates;
    let newCalcCoordinates = result.calcCoordinates;

    geometry.set("calcCoordinates", newCalcCoordinates);

    let type = geometry.getType();
    geometry = this.setGeometryCoordinate(geometry, type, coordinates);
    return geometry;
  }

  calculate(points) {
    let coordinates = this.calculate_(points);
    let calcCoordinates = points.map((x, i) => {
      return { index: i, coordinate: x };
    });
    return { coordinates, calcCoordinates };
  }

  calculate_(points) {
    return points;
  }

  getGeometryByCoordinates(
    coordinates,
    opt_type,
    opt_geometry,
    calcCoordinates
  ) {
    let geometry = this.setGeometryCoordinate(
      opt_geometry,
      opt_type,
      coordinates
    );

    let num =
      coordinates.length < this.controlSum
        ? coordinates.length
        : this.controlSum;
    geometry.set("num", num); // 当前点数
    geometry.set("sum", this.controlSum); // 控制点总数
    geometry.set("calcCoordinates", calcCoordinates); // 控制点
    geometry.set("update", this.update.bind(this)); // 更新
    return geometry;
  }

  setGeometryCoordinate(geometry, type, coordinates) {
    if (geometry) {
      if (type === GeometryType.LINE_STRING) {
        geometry.setCoordinates(coordinates);
      } else {
        geometry.setCoordinates([coordinates]);
      }
    } else {
      if (type === GeometryType.LINE_STRING) {
        geometry = new LineString(coordinates);
      } else {
        geometry = new Polygon([coordinates]);
      }
    }
    return geometry;
  }
}

export default Shape;
