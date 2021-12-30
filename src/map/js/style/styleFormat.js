/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2020-07-14 15:56:39
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2020-08-06 11:00:52
 * @ Description:样式格式转换
 */

import { asArray } from "ol/color";

export function getStyleInfoByLayerStyle(style) {
  let result = {
    fill: null,
    stroke: null,
    text: null,
    image: null,
    radius: null,
  };
  if (!style) {
    return result;
  }

  let fillStyle = style.getFill();
  let strokeStyle = style.getStroke();
  let textStyle = style.getText();
  let imageStyle = style.getImage();
  if (fillStyle) {
    result.fill = getFill(fillStyle);
  }

  if (strokeStyle) {
    result.stroke = getStroke(strokeStyle);
  }

  if (textStyle) {
    result.text = {
      font: getFontStirngToObject(textStyle.getFont()),
      offsetX: textStyle.getOffsetX(),
      offsetY: textStyle.getOffsetY(),
      rotation: textStyle.getRotation(),
      text: textStyle.getText(),
      textAlign: textStyle.getTextAlign(),
      textBaseline: textStyle.getTextBaseline(),
      fill: getFill(textStyle.getFill()),
      stroke: getStroke(textStyle.getStroke()),
      backgroundFill: textStyle.getBackgroundFill(),
      backgroundStroke: textStyle.getBackgroundStroke(),
      padding: textStyle.getPadding(),
    };
  }

  if (imageStyle) {
    // ol.style.Icon类型
    if (imageStyle.getSrc) {
      let imageElement = imageStyle.getImage();
      result.image = {
        opacity: imageStyle.getOpacity(),
        rotation: imageStyle.getRotation(),
        scale: imageStyle.getScale(),
        imgurl: imageStyle.getSrc().replace(style.item.prefixUrl, ""), // 去掉前缀
        width: imageElement.width,
        height: imageElement.height,
        offsetX: imageElement.offsetLeft,
        offsetY: imageElement.offsetTop,
      };
    }
    // ol.style.Circle类型
    if (imageStyle.getRadius) {
      result.radius = imageStyle.getRadius();
    }
  }

  return result;
}

function getFill(fillStyle) {
  if (fillStyle) {
    return {
      color: asArray(fillStyle.getColor()),
    };
  }
  return null;
}

function getStroke(strokeStyle) {
  if (strokeStyle) {
    return {
      color: asArray(strokeStyle.getColor()),
      lineCap:
        strokeStyle.getLineCap() !== undefined
          ? strokeStyle.getLineCap()
          : null,
      lineJoin:
        strokeStyle.getLineJoin() !== undefined
          ? strokeStyle.getLineJoin()
          : null,
      lineDash: strokeStyle.getLineDash(),
      lineDashOffset:
        strokeStyle.getLineDashOffset() !== undefined
          ? strokeStyle.getLineDashOffset()
          : null,
      miterLimit: strokeStyle.getMiterLimit() || 10,
      width: strokeStyle.getWidth(),
    };
  }
  return null;
}

function getFontStirngToObject(string) {
  if (!string) {
    return;
  }

  let fonts = string.split(" ");
  return {
    fontFamily: fonts[3],
    fontSize: Number.parseFloat(fonts[2]),
    sizeUnit: "px",
    fontWeight: fonts[1],
    fontStyle: fonts[0],
    textDecoration: null,
    color: null,
    lineHeight: 0,
  };
}
