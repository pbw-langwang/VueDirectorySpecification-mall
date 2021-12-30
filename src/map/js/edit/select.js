import SelectPoint from "./select_point";
import SelectBox from "./select_box";
import TranslateHandler from "./translate";

import { getFeaturesCenter, getFeaturesExtent } from "../feature";

/**
 * 矢量数据选择，支持点选、shift+drag
 */
class Select {
  constructor({
    map,
    layer,
    isTranslate,
    callback,
    translateStartCallback,
    translateEndCallback
  }) {
    this.map_ = map;

    this.layer_ = layer;

    this.select = null;

    this.selectBox = null;

    this.isTranslate = isTranslate != null ? isTranslate : true;

    this.translate = null;

    this.selectedFeatures = null; // new Collection();

    this.create(callback, translateStartCallback, translateEndCallback);
  }

  getSelectFeatures() {
    return this.selectedFeatures;
  }

  create(callback, translateStartCallback, translateEndCallback) {
    this.select = new SelectPoint({
      map: this.map_,
      layer: this.layer_,
      callback: null
    });

    this.selectBox = new SelectBox({
      map: this.map_,
      layer: this.layer_,
      callback: features => {
        features.forEach(f => {
          this.selectedFeatures.push(f);
        });
      }
    });

    this.selectedFeatures = this.select.getSelect().getFeatures();
    this.selectedFeatures.on(["add", "remove"], () => {
      callback && callback(this.selectedFeatures.getArray());
    });

    if (this.isTranslate) {
      this.translate = new TranslateHandler({
        map: this.map_,
        features: this.selectedFeatures,
        translateStartCallback,
        translateEndCallback
      });
    }
  }

  active() {
    this.select && this.select.active();
    this.selectBox && this.selectBox.active();
    this.translate && this.translate.active();
    this.selectedFeatures.clear();
  }

  deActive() {
    this.select && this.select.deActive();
    this.selectBox && this.selectBox.deActive();
    this.translate && this.translate.deActive();
    this.selectedFeatures.clear();
  }

  destroy() {
    this.select && this.select.destroy();
    this.selectBox && this.selectBox.destroy();
    this.translate && this.translate.destroy();
    this.select = null;
    this.selectBox = null;
    this.translate = null;
    this.selectedFeatures.clear();
  }

  copy() {
    if (this.selectedFeatures) {
      let features = this.selectedFeatures.getArray();
      if (features.length) {
        return features.map(x => {
          let feature = x.clone();
          feature.setStyle(null);
          return feature;
        });
      }
    }
    return null;
  }

  delete() {
    if (this.layer_) {
      let source = this.layer_.getSource();
      this.selectedFeatures.forEach(f => {
        source.removeFeature(f);
      });
      this.clear();
    }
  }

  fit() {
    if (this.selectedFeatures) {
      let features = this.selectedFeatures.getArray();
      let extent = getFeaturesExtent(features);
      if (extent) {
        let view = this.map_.getView();
        view.fit(extent, { padding: [10, 10, 10, 10], duration: 3000 });
      }
    }
  }

  pan() {
    if (this.selectedFeatures) {
      let features = this.selectedFeatures.getArray();
      let center = getFeaturesCenter(features);
      if (center) {
        let view = this.map_.getView();
        view.setCenter(center);
      }
    }
  }

  clear() {
    this.selectedFeatures.clear();
  }
}

export default Select;
