import { getUid } from "ol/util.js";
import DrawBox from "./drawClass";
import { getStyleFunction } from "./drawStyle";

const originalFeatureStyles = {};

class SelectShape {
  /**
   *
   * @param {Object} params
   * @param {import("ol/Map")} params.map
   * @param {import('ol/layer/Vector')} params.layer
   * @param {Function(Array<import("ol/Feature")>)} params.callback 选中后的回调函数
   */
  constructor({ map, layer, drawType, callback } = {}) {
    // 地图
    this.map_ = map;
    // 图层
    this.layer_ = layer;

    this.drawType_ = drawType;

    this.features_ = [];

    this.style_ = null;

    this.drawBox = null;

    this.init(callback);
  }

  getMap() {
    return this.map_;
  }

  getLayer() {
    return this.layer_;
  }

  getStyle() {
    return this.style_;
  }

  init(callback) {
    if (!this.map_) {
      return;
    }

    this.destroy();

    this.style_ = getStyleFunction(this.drawType_);

    this.drawBox = new DrawBox({
      map: this.map_,
      drawType: this.drawType_,
      showTip: false,
      startCallback: () => {
        this.removeFeatures_();
      },
      endCallback: feature => {
        if (this.layer_) {
          let extent = feature.getGeometry().getExtent();

          this.layer_
            .getSource()
            .forEachFeatureIntersectingExtent(extent, f => {
              this.applySelectedStyle_(f);
              this.features_.push(f);
            });

          callback && callback(this.features_);
        } else {
          callback && callback(feature);
        }
      }
    });
  }

  destroy() {
    this.removeFeatures_();
    this.drawBox && this.drawBox.destroy();
  }

  removeFeatures_() {
    this.features_.forEach(f => {
      this.restorePreviousStyle_(f);
    });
    this.features_ = [];
  }

  active() {
    this.drawBox && this.drawBox.setActive(true);
  }

  deActive() {
    this.drawBox && this.drawBox.setActive(false);
  }

  applySelectedStyle_(feature) {
    const key = getUid(feature);
    if (!(key in originalFeatureStyles)) {
      originalFeatureStyles[key] = feature.getStyle();
    }
    if (this.style_) {
      feature.setStyle(this.style_);
    }
  }

  restorePreviousStyle_(feature) {
    const key = getUid(feature);
    feature.setStyle(originalFeatureStyles[key]);
    delete originalFeatureStyles[key];
  }
}

export default SelectShape;
