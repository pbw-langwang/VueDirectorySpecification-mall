import Select from "ol/interaction/Select";
import { click } from "ol/events/condition";

class SelectPoint {
  /**
   *
   * @param {Object} params
   * @param {import("ol/Map")} params.map
   * @param {import('ol/layer/Vector')} [params.layer] If the option is absent, all visible layers will be considered selectable.
   * @param {Function(Array<import("ol/Feature")>)} params.callback 选中后的回调函数
   */
  constructor({ map, layer, callback }) {
    // 地图
    this.map_ = map;
    // 图层
    this.layer_ = layer || null;

    this.select = null;

    this.init(callback);
  }

  getMap() {
    return this.map_;
  }

  getLayer() {
    return this.layer_;
  }

  getSelect() {
    return this.select;
  }

  init(callback) {
    if (!this.map_) {
      return;
    }

    this.destroy();

    this.addSelectInteraction();

    this.select.on("select", e => {
      let features = e.target.getFeatures().getArray();
      callback && callback(features);
    });
  }

  destroy() {
    this.removeSelectInteraction();
  }

  active() {
    this.select.setActive(true);
  }

  deActive() {
    this.select.setActive(false);
  }

  addSelectInteraction() {
    if (this.map_) {
      let params = { condition: click, multi: true, hitTolerance: 2 };
      if (this.layer_) {
        params = { ...params, layers: [this.layer_] };
      }
      this.select = new Select(params);
      this.map_.addInteraction(this.select);
    }
  }

  removeSelectInteraction() {
    if (this.select) {
      this.map_.removeInteraction(this.select);
      this.select = null;
    }
  }
}

export default SelectPoint;
