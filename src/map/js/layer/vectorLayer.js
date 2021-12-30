import VectorLayer from "ol/layer/Vector";
import Cluster from "ol/source//Cluster";
import { Circle, Fill, Icon, Stroke, Style, Text } from "ol/style";
import { ObjectEvent } from "ol/Object";

import { getGeometry } from "../feature";
import LAYER_DATA_TYPE from "./layerDataType";

/**
 * @typedef {Object} Style
 * @property {import("ol/geom/Geometry") | import("ol/style/Style").GeometryFunction }
 * @property {import("ol/style/Stroke").Options} stroke
 * @property {import("ol/style/Fill").Options} fill
 * @property {import("ol/style/Icon").Options} icon
 * @property {import("ol/style/Text").Options} text
 * @property (import("ol/style/Circle").Options) circle
 * @property {import("ol/style/Style").RenderFunction} renderer
 */

/**
 * @typedef {Object} Options
 * @property {import("ol/source/Vector")} source - 数据源
 * @property {Style| Array<Style> | function } styles - 样式  {具体可参考@link getStyles() 函数说明 }
 * @property {import("ol/layer/Vector").options} options - 其他图层参数
 */

class DxVectorLayer extends VectorLayer {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    options = { ...options };
    let param = {
      source: options.source,
      style: options.styles ? getStyles(options.styles) : undefined,
      ...options
    };
    super(param);

    if (options.source && options.source instanceof Cluster) {
      this.layerDateType = LAYER_DATA_TYPE.CLUSTER;
    } else {
      this.layerDateType = LAYER_DATA_TYPE.VECTOR;
    }

    this.hoverStyles = null;

    this.ghostFeatureStyle = null;
  }

  setSource(source) {
    super.setSource(source);

    if (source && source instanceof Cluster) {
      this.layerDateType = LAYER_DATA_TYPE.CLUSTER;
    } else {
      this.layerDateType = LAYER_DATA_TYPE.VECTOR;
    }
  }

  setHoverStyles(hoverStyles) {
    this.unEvent();
    this.hoverStyles = hoverStyles;
    if (this.hoverStyles) {
      this.on("pointerenter", this.handlerPointerEnter);
      this.on("pointerleave", this.handlerPointerLeave);
    }
  }

  handlerPointerEnter(e) {
    let feature = e.feature;
    if (this.hoverStyles && feature) {
      this.ghostFeatureStyle = feature.getStyle();
      feature.setStyle(getStyles(this.hoverStyles));
    }
  }

  handlerPointerLeave(e) {
    let feature = e.feature;
    if (feature) {
      feature.setStyle(feature.ghostFeatureStyle || this.ghostFeatureStyle);
    }
  }

  unEvent() {
    this.un("pointerenter", this.handlerPointerEnter);
    this.un("pointerleave", this.handlerPointerLeave);
  }

  pointerenter(feature) {
    let event = new ObjectEvent("pointerenter");
    event.feature = feature;
    this.dispatchEvent(event);
  }

  pointerleave(feature) {
    let event = new ObjectEvent("pointerleave");
    event.feature = feature;
    this.dispatchEvent(event);
  }
}

export default DxVectorLayer;

/**
 * 根据对象、数组或函数获取样式
 * eg:
 * function = (feature, resolution) => {
 *   let name = feature.get("name").toString();
 *   return {
 *     text : {
 *        text:name
 *     },
 *     circle: {
 *       fill: { color: "rgba(255,0,0,0.8)" },
 *       stroke: {
 *         width: 1,
 *         color: "#000"
 *       },
 *       radius: name.length + 5 || 5
 *     },
 *     geometry:{
 *       type:"Point",
 *       coordinates:[0,0]
 *     }
 *   }
 * }
 * @param {Style| Array<Style> | function} options
 * @return styles
 */
export function getStyles(options) {
  if (typeof options === "function") {
    let fn = (feature, resolution) => {
      let styles = options(feature, resolution);
      return getStyles_(styles);
    };
    return fn;
  }

  return getStyles_(options);
}

/**
 * 根据数组或对象获取样式
 * @param {Style| Array<Style>} options
 * @returns style
 */
function getStyles_(options) {
  // 数据深拷贝，不影响原来的数据
  options = JSON.parse(JSON.stringify(options));
  if (Array.isArray(options)) {
    let styles = [];
    options.forEach(x => {
      let s = getStyle_(x);
      if (s) {
        styles.push(s);
      }
    });
    return styles;
  }

  return getStyle_(options);
}

/**
 * 根据对象获取样式
 * @param {Style} options
 * @return styles
 */
function getStyle_(options) {
  if (options) {
    let style = new Style();
    if (options.fill) {
      let fill = new Fill(options.fill);
      style.setFill(fill);
    }
    if (options.stroke) {
      let stroke = new Stroke(options.stroke);
      style.setStroke(stroke);
    }
    if (options.icon) {
      let icon = new Icon(options.icon);
      style.setImage(icon);
    }
    if (options.geometry) {
      let geometry = getGeometry(options.geometry);
      style.setGeometry(geometry);
    }
    if (options.text) {
      if (options.text.fill) {
        options.text.fill = new Fill(options.text.fill);
      }
      if (options.text.stroke) {
        options.text.stroke = new Stroke(options.text.stroke);
      }
      if (options.text.backgroundFill) {
        options.text.backgroundFill = new Fill(options.text.backgroundFill);
      }
      if (options.text.backgroundStroke) {
        options.text.backgroundStroke = new Stroke(
          options.text.backgroundStroke
        );
      }
      let text = new Text(options.text);
      style.setText(text);
    }
    if (options.circle) {
      if (options.circle.fill) {
        options.circle.fill = new Fill(options.circle.fill);
      }
      if (options.circle.stroke) {
        options.circle.stroke = new Stroke(options.circle.stroke);
      }
      let circle = new Circle(options.circle);
      style.setImage(circle);
    }
    if (options.renderer) {
      style.setRenderer(options.renderer);
    }
    return style;
  }
}
