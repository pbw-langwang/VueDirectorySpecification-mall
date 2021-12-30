import VectorImageLayer from "ol/layer/VectorImage";
import { ObjectEvent } from "ol/Object";
import { getStyles } from "./vectorLayer";

import LAYER_DATA_TYPE from "./layerDataType";

class DxVectorImageLayer extends VectorImageLayer {
  /**
   *
   * @param {Options} options
   */
  constructor(options) {
    options = {
      ...options
    };
    let param = {
      source: options.source,
      style: options.styles ? getStyles(options.styles) : undefined,
      ...options
    };
    super(param);

    this.layerDateType = LAYER_DATA_TYPE.VECTOR_IMAGE;

    this.hoverStyles = null;

    this.ghostFeatureStyle = null;
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

export default DxVectorImageLayer;
