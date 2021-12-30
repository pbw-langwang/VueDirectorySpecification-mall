import { DRAW_TYPE } from "./drawType";
import { createRegularPolygon, createBox } from "ol/interaction/Draw";
import { getStyleFunction } from "./drawStyle";

import shape from "./shape/index";

export function getDrawParams(drawType) {
  let geometryFunction = null;
  let type = null;
  let freehand = false;
  let style = getStyleFunction(drawType);
  switch (drawType) {
    case DRAW_TYPE.BOX:
      type = DRAW_TYPE.CIRCLE;
      geometryFunction = createBox();
      break;
    case DRAW_TYPE.SQUARE:
      type = DRAW_TYPE.CIRCLE;
      geometryFunction = createRegularPolygon(4);
      break;
    case DRAW_TYPE.RECTANGLE_LINE:
      type = DRAW_TYPE.LINE_STRING;
      geometryFunction = new shape.Rectangle().create(drawType, type);
      break;
    case DRAW_TYPE.CIRCLE_LINE:
      type = DRAW_TYPE.LINE_STRING;
      geometryFunction = new shape.Circle().create(drawType, type);
      break;
    case DRAW_TYPE.ELLIPSE_LINE:
      type = DRAW_TYPE.LINE_STRING;
      geometryFunction = new shape.Ellipse().create(drawType, type);
      break;
    case DRAW_TYPE.RECTANGLE:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.Rectangle().create(drawType, type);
      break;
    case DRAW_TYPE.CIRCLE:
      type = DRAW_TYPE.CIRCLE;
      geometryFunction = new shape.Circle().create(drawType, type);
      break;
    case DRAW_TYPE.ELLIPSE:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.Ellipse().create(drawType, type);
      break;
    case DRAW_TYPE.FREEHAND_LINE:
      type = DRAW_TYPE.LINE_STRING;
      freehand = true;
      break;
    case DRAW_TYPE.FREEHAND_POLYGON:
      type = DRAW_TYPE.POLYGON;
      freehand = true;
      break;
    case DRAW_TYPE.ARC:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.Arc().create(drawType, type);
      break;
    case DRAW_TYPE.ARC_LINE:
      type = DRAW_TYPE.LINE_STRING;
      geometryFunction = new shape.Arc().create(drawType, type);
      break;
    case DRAW_TYPE.CURVE:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.Curve().create(drawType, type);
      break;
    case DRAW_TYPE.CURVE_LINE:
      type = DRAW_TYPE.LINE_STRING;
      geometryFunction = new shape.Curve().create(drawType, type);
      break;
    case DRAW_TYPE.SECTOR:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.Sector().create(drawType, type);
      break;
    case DRAW_TYPE.SECTOR_LINE:
      type = DRAW_TYPE.LINE_STRING;
      geometryFunction = new shape.Sector().create(drawType, type);
      break;
    case DRAW_TYPE.ARROW_LINE:
      type = DRAW_TYPE.LINE_STRING;
      geometryFunction = new shape.Arrow().create(drawType, type);
      break;
    case DRAW_TYPE.ARROW_POLYGON:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.ArrowPolygon().create(drawType, type);
      break;
    case DRAW_TYPE.DOUBLE_ARROW:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.DoubleArrow().create(drawType, type);
      break;
    case DRAW_TYPE.ATTACK_ARROW:
      type = DRAW_TYPE.POLYGON;
      geometryFunction = new shape.AttackArrow().create(drawType, type);
      break;
    default:
      type = drawType;
      break;
  }

  return { geometryFunction, type, style, freehand };
}
