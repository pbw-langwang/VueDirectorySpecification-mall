import { getGeometryCount } from "./drawCount";
import { DRAW_TYPE } from "./drawType";

export function createTooltip(drawType, feature) {
  let content = getTooltipContent(drawType, feature);
  let tooltipElement = document.createElement("div");
  tooltipElement.className = "tooltip";
  tooltipElement.style.cssText =
    "color:#000;background: #fff;border: 1px solid #000;padding: 2px 8px;font-size: 12px;";
  tooltipElement.innerHTML = content;

  return tooltipElement;
}

function getTooltipContent(drawType, feature) {
  let content = "单击，开始绘制";
  let freeContent = null;
  switch (drawType) {
    case DRAW_TYPE.FREEHAND_LINE:
    case DRAW_TYPE.FREEHAND_POLYGON:
      content = "按住鼠标左键后移动，开始绘制";
      freeContent = "松开鼠标左键，结束绘制";
      break;
    case DRAW_TYPE.POINT:
      content = "单击";
      break;
    default:
      break;
  }

  if (!feature) {
    return content;
  }

  let geometry = feature.getGeometry();
  let { fixCount, count } = getGeometryCount(geometry, drawType);

  let mid = "单击继续绘制";
  let end = "双击结束绘制";
  let countContent = `<strong style = "color:red">${count}</strong>`;
  let fixCountContent = `<strong style = "color:red">${fixCount}</strong>`;
  content = `控制点无限制，当前为第${countContent}个控制点，${mid}，${end}`;

  if (!fixCount) {
    return freeContent || content;
  }

  if (count < fixCount) {
    content = `共有${fixCountContent}控制点，当前为第${countContent}个控制点，${mid}`;
  } else if (count === fixCount) {
    content = `共有${fixCountContent}控制点，当前为第${countContent}个控制点，${end}`;
  }
  return content;
}
