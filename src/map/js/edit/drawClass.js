/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2020-08-03 13:48:29
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2021-07-05 11:34:31
 * @ Description: 绘制业务图层相关类及绘制类型
 */

import { Draw, Snap } from "ol/interaction";
import Overlay from "ol/Overlay.js";
import { DRAW_TYPE } from "./drawType";
import { getDrawParams } from "./drawParams";
import { createTooltip } from "./drawTip";

/**
 * @description 绘制对象,负责绘制和捕捉要素
 */
class DrawClass {
  /**
   * @param {Object} params
   * @param  {ol.map} params.map
   * @param  {ol.layer} [params.layer]
   * @param  {DRAW_TYPE} [params.drawType] = DRAW_TYPE.BOX
   * @param  {Number} [params.maxNum]  = 2000
   * @param {Boolean} [params.isLimit] = false
   * @param {Boolean} [params.showTip] = true
   * @param {Function} {params.startCallback}
   * @param {Function} {params.endCallback}
   */
  constructor({
    map,
    layer,
    drawType,
    maxNum,
    isLimit,
    showTip,
    startCallback,
    endCallback
  }) {
    // 地图
    this.map_ = map;
    // 图层
    this.layer_ = layer || null;
    // 图层绘制类型
    this.drawType_ = drawType || DRAW_TYPE.BOX; // 默认绘制矩形的面
    // 图层最大要素
    this.maxNum_ = maxNum || 2000;
    // 是否开启图层限制
    this.isLimit = isLimit || false;
    // 当前绘制回合类的要素集
    this.currentFeatures_ = [];

    this.draw_ = null;

    this.snap_ = null;

    this.sketchFeature = null;

    this.pointermoveHandler_ = e => this.pointermoveHandler(e);

    this.tooltip = null;

    this.showTip = showTip !== undefined ? showTip : true;

    this.init({ startCallback, endCallback });
  }

  getMap() {
    return this.map_;
  }

  getLayer() {
    return this.layer_;
  }

  getCurrentFeatures() {
    return this.currentFeatures_;
  }

  getDraw() {
    return this.draw_;
  }

  getSnap() {
    return this.snap_;
  }

  getDrawType() {
    return this.drawType_;
  }

  setDrawType(value) {
    this.drawType_ = value;
    this.init();
  }

  setLayer(value) {
    this.layer_ = value;
    this.init();
  }

  // 初始化绘制
  init({ startCallback, endCallback } = {}) {
    if (!this.map_) {
      return;
    }

    // 判断是否已添加交互事件，若存在，则先移除
    this.destroy();

    this.addDrawInteraction();
    this.addSnapInteraction();

    this.showTip && this.map_.on("pointermove", this.pointermoveHandler_);
    // 开始绘制
    this.draw_.on("drawstart", evt => {
      let feature = evt.feature;
      this.sketchFeature = feature;

      if (this.isLimit) {
        let flag = this.limitFeatures();
        if (flag) {
          this.destroy();
          alert(flag);
          return;
        }
      }

      if (startCallback) {
        startCallback(feature);
      }
    });
    // 结束绘制
    this.draw_.on("drawend", e => {
      if (endCallback) {
        let feature = e.feature;
        feature.getGeometry().drawType = this.drawType_;
        this.currentFeatures_.push(feature);
        endCallback(e.feature);
      }

      this.sketchFeature = null;
      this.removeTooltip();
    });
  }

  finish() {
    if (this.draw_) {
      this.draw_.finishDrawing();
    }
  }

  // 移除绘制
  destroy() {
    if (this.map_) {
      this.removeDrawInteraction();
      this.removeSnapInteraction();
      this.showTip && this.map_.un("pointermove", this.pointermoveHandler_);
    }
    this.removeTooltip();
  }

  active() {
    this.draw_.setActive(true);
    this.showTip && this.map_.on("pointermove", this.pointermoveHandler_);
  }

  deActive() {
    this.draw_.setActive(false);
    this.showTip && this.map_.un("pointermove", this.pointermoveHandler_);
    if (this.tooltip) {
      this.tooltip.setPosition(undefined);
    }
  }

  //限制要素个数
  limitFeatures() {
    if (!this.layer_) {
      return;
    }
    let length = this.layer_.getSource().getFeatures().length;
    if (length >= this.maxNum_) {
      this.destroy();
      return `当前图层要素已达到 ${this.maxNum_}个 ！`;
    }
    return;
  }

  // 添加要素
  addFeature(feature) {
    if (this.layer_ && feature) {
      this.layer_.getSource().addFeature(feature);
    }
  }

  removeFeature(feature) {
    if (this.layer_ && feature) {
      this.layer_.getSource().removeFeature(feature);
    }
  }

  // 移除该回合类的要素集
  clearCurrentFeatures() {
    if (this.layer_) {
      this.currentFeatures_.forEach(x => {
        this.layer_.getSource().removeFeature(x);
      });
      this.currentFeatures_ = [];
    }
  }

  // 移除该图层的所有要素
  clearAllFeature() {
    if (this.layer_) {
      this.layer_.getSource().clear();
    }
  }

  addDrawInteraction() {
    let params = getDrawParams(this.drawType_);
    const source = this.layer_ ? this.layer_.getSource() : undefined;
    if (params && params.type) {
      this.draw_ = new Draw({ source, stopClick: true, ...params });
      this.map_.addInteraction(this.draw_);
    }
  }

  addSnapInteraction() {
    if (this.layer_) {
      this.snap_ = new Snap({ source: this.layer_.getSource() });
      this.map_.addInteraction(this.snap_);
    }
  }

  removeDrawInteraction() {
    if (this.draw_) {
      this.map_.removeInteraction(this.draw_);
      this.draw_ = null;
    }
  }

  removeSnapInteraction() {
    if (this.snap_) {
      this.map_.removeInteraction(this.snap_);
      this.snap_ = null;
    }
  }

  removeTooltip() {
    if (this.tooltip) {
      this.map_.removeOverlay(this.tooltip);
      this.tooltip = null;
    }
  }

  pointermoveHandler(e) {
    this.tooltipEvent(e.coordinate);
  }

  tooltipEvent(coordinate) {
    let tooltipElement = createTooltip(this.drawType_, this.sketchFeature);
    if (this.tooltip) {
      this.tooltip.setElement(tooltipElement);
    } else {
      this.tooltip = new Overlay({
        element: tooltipElement,
        offset: [0, -15],
        positioning: "bottom-center"
      });
      this.map_.addOverlay(this.tooltip);
    }
    this.tooltip.setPosition(coordinate);
  }
}

export default DrawClass;
