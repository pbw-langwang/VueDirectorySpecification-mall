/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2021-06-24 16:22:15
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2021-08-04 17:38:01
 * @ Description: 获取图形的控制点、当前已绘制数
 */
import { DRAW_TYPE } from "./drawType";

/**
 * 获取图形的控制点、当前已绘制数
 * @param  {{...import("ol/geom/Geometry"),num}} geometry 自定义的函数，需增加num字段
 * @param  {DRAW_TYPE} drawType
 * @returns {fixCount, count}
 */
export function getGeometryCount(geometry, drawType) {
  let fixCount = 0; // 控制点个数
  let count = 0; // 当前已绘制数
  switch (drawType) {
    case DRAW_TYPE.POINT:
      fixCount = 1;
      count = geometry.getCoordinates().length;
      break;
    case DRAW_TYPE.LINE_STRING:
      fixCount = 0;
      count = geometry.getCoordinates().length;
      break;
    case DRAW_TYPE.POLYGON:
      fixCount = 0;
      count = geometry.getCoordinates()[0].length; // 外环
      break;
    case DRAW_TYPE.BOX:
    case DRAW_TYPE.SQUARE:
      fixCount = 2;
      count = geometry.getCoordinates()[0].length ? 2 : 1;
      break;
    case DRAW_TYPE.RECTANGLE_LINE:
    case DRAW_TYPE.RECTANGLE:
    case DRAW_TYPE.CIRCLE_LINE:
    case DRAW_TYPE.CIRCLE:
    case DRAW_TYPE.ELLIPSE_LINE:
    case DRAW_TYPE.ELLIPSE:
    case DRAW_TYPE.ARROW_LINE:
    case DRAW_TYPE.ARC:
    case DRAW_TYPE.ARC_LINE:
    case DRAW_TYPE.CURVE:
    case DRAW_TYPE.CURVE_LINE:
    case DRAW_TYPE.SECTOR:
    case DRAW_TYPE.SECTOR_LINE:
    case DRAW_TYPE.ARROW_POLYGON:
    case DRAW_TYPE.DOUBLE_ARROW:
    case DRAW_TYPE.ATTACK_ARROW:
      fixCount = geometry.get("sum");
      count = geometry.get("num");
      break;
    default:
      break;
  }
  return { fixCount, count };
}
