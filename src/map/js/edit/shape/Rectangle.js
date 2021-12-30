import Shape from "./Shape";
import { calculateRectPoints, updateRectPoints } from "../../math";

class Rectangle extends Shape {
  constructor() {
    super();

    this.controlSum = 3;
  }

  update(geometry, index, coordinate) {
    let calcCoordinates = geometry.get("calcCoordinates");
    let coordinates = calcCoordinates.map(x => {
      return x.coordinate;
    });

    coordinates = updateRectPoints(coordinates, index, coordinate);
    let newCalcCoordinates = coordinates.slice(0, 3).map((x, i) => {
      return {
        index: i,
        coordinate: x
      };
    });
    geometry.set("calcCoordinates", newCalcCoordinates);

    let type = geometry.getType();
    geometry = this.setGeometryCoordinate(geometry, type, coordinates);
    return geometry;
  }

  calculate_(points) {
    const one = points[0];
    const two = points[1];
    const three = points[2];
    let coordinates = calculateRectPoints(one, two, three);
    coordinates = [...coordinates, one];

    return coordinates;
  }
}

export default Rectangle;
