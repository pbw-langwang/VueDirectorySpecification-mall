import CircleStyle from "ol/style/Circle.js";
import Fill from "ol/style//Fill.js";
import Stroke from "ol/style//Stroke.js";
import Style from "ol/style/Style";
import GeometryType from "ol/geom/GeometryType";
import { DRAW_TYPE } from "./drawType";

export function getStyleFunction(drawType) {
  const styles = createEditingStyle();
  return function(feature, resolution) {
    switch (drawType) {
      case DRAW_TYPE.RECTANGLE:
      case DRAW_TYPE.CIRCLE:
      case DRAW_TYPE.ELLIPSE:
      case DRAW_TYPE.ARC:
      case DRAW_TYPE.CURVE:
      case DRAW_TYPE.SECTOR:
      case DRAW_TYPE.ARROW_POLYGON:
      case DRAW_TYPE.DOUBLE_ARROW:
      case DRAW_TYPE.ATTACK_ARROW:
        if (feature.getGeometry().getType() === GeometryType.LINE_STRING) {
          return;
        }
        break;

      default:
        break;
    }
    return styles[feature.getGeometry().getType()];
  };
}

export function createEditingStyle() {
  const styles = {};
  const white = [255, 255, 255, 1];
  const blue = [0, 153, 255, 1];
  const width = 3;
  let FillStyle = [
    new Style({
      fill: new Fill({
        color: [255, 255, 255, 0.5]
      })
    })
  ];

  let strokeStyle = [
    new Style({
      stroke: new Stroke({
        color: white,
        width: width + 2
      })
    }),
    new Style({
      stroke: new Stroke({
        color: blue,
        width: width
      })
    })
  ];

  styles[GeometryType.POLYGON] = FillStyle.concat(strokeStyle);
  styles[GeometryType.MULTI_POLYGON] = styles[GeometryType.POLYGON];

  styles[GeometryType.LINE_STRING] = strokeStyle;
  styles[GeometryType.MULTI_LINE_STRING] = styles[GeometryType.LINE_STRING];

  styles[GeometryType.CIRCLE] = FillStyle.concat(strokeStyle);

  styles[GeometryType.POINT] = [
    new Style({
      image: new CircleStyle({
        radius: width * 2,
        fill: new Fill({
          color: blue
        }),
        stroke: new Stroke({
          color: white,
          width: width / 2
        })
      }),
      zIndex: Infinity
    })
  ];
  styles[GeometryType.MULTI_POINT] = styles[GeometryType.POINT];

  styles[GeometryType.GEOMETRY_COLLECTION] = styles[
    GeometryType.POLYGON
  ].concat(styles[GeometryType.LINE_STRING], styles[GeometryType.POINT]);

  return styles;
}
