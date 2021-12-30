import Translate from "ol/interaction/Translate";

class TranslateHandler {
  constructor({
    map,
    select,
    features,
    translateStartCallback,
    translateEndCallback
  }) {
    this.map_ = map;

    this.select = select;

    this.features =
      features || (this.select ? this.select.getFeatures() : null);

    this.init(translateStartCallback, translateEndCallback);
  }

  init(translateStartCallback, translateEndCallback) {
    if (!this.map_) {
      return;
    }

    this.destroy();

    this.addInteraction();

    this.translate.on("translatestart", e => {
      if (translateStartCallback) {
        translateStartCallback(e.features.getArray());
      }
    });

    this.translate.on("translateend", e => {
      if (translateEndCallback) {
        translateEndCallback(e.features.getArray());
      }
    });
  }

  destroy() {
    this.removeInteraction();
  }

  active() {
    this.translate && this.translate.setActive(true);
  }

  deActive() {
    this.translate && this.translate.setActive(false);
  }

  addInteraction() {
    if (this.map_) {
      this.translate = new Translate({
        features: this.features
      });
      this.map_.addInteraction(this.translate);
    }
  }

  removeInteraction() {
    if (this.translate) {
      this.map_.removeInteraction(this.translate);
      this.translate = null;
    }
  }
}

export default TranslateHandler;
