/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2020-08-03 13:48:29
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2020-12-07 13:41:18
 * @ Description: 绘制业务图层相关类及绘制类型
 */

import { Draw, Modify, Snap } from "ol/interaction";
import { createRegularPolygon, createBox } from "ol/interaction/Draw";
import { never } from "ol/events//condition";
import Overlay from "ol/Overlay.js";

// 绘制类型 'Point', 'LineString', 'Polygon', 'Circle'，'Box', 'Square'
export const DrawType = {
  POINT: "Point",
  LINESTRING: "LineString",
  POLYGON: "Polygon",
  CIRCLE: "Circle",
  BOX: "Box",
  SQUARE: "Square",
};

/**
 * @description 绘制业务图层对象
 */
class DrawClass {
  /**
   * @param {Object} params
   * @param  {ol.map} params.map
   * @param  {ol.layer} params.layer
   * @param  {DrawType} params.drawType = DrawType.BOX
   * @param  {Number} params.maxNum  = 2000
   */
  constructor({ map, layer, drawType, maxNum }) {
    // 地图
    this.map_ = map;
    // 图层
    this.layer_ = layer;
    // 图层绘制类型
    this.drawType_ = drawType || DrawType.BOX; // 默认绘制矩形的面
    // 图层最大要素
    this.maxNum_ = maxNum || 2000;
    // 是否只编辑
    this.isOnlyEdit_ = false;
    // 当前绘制回合类的要素集
    this.currentFeatures_ = [];

    this.draw_ = null;

    this.snap_ = null;

    this.modify_ = null;

    this.sketchFeature = null;
    this.point_num = null;

    this.pointerFeature = null;
    this.pointermoveHandler_ = (e) => this.pointermoveHandler(e);

    this.tooltip = null;
  }

  finishDraw() {
    if (this.draw_) {
      this.draw_.finishDrawing();
    }
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

  getModify() {
    return this.modify_;
  }

  // 初始化绘制
  initDraw({ startCallback, endCallback, modifyCallback, point_num }) {
    if (!this.map_ || !this.layer_) {
      return;
    }

    // 判断是否已添加交互事件，若存在，则先移除
    this.removeDraw(this.map_);

    if (this.isOnlyEdit_ === false) {
      this.addDrawInteraction();
    }
    this.addSnapInteraction();
    this.addModifyInteraction(modifyCallback);

    this.map_.on("pointermove", this.pointermoveHandler_);
    // 开始绘制
    this.draw_.on("drawstart", (evt) => {
      let feature = evt.feature;
      this.sketchFeature = feature;
      if (startCallback) {
        startCallback(feature);
      }

      if (point_num) {
        this.point_num = point_num;
        this.pointNumEvent(feature, point_num);
      }
    });
    // 结束绘制
    this.draw_.on("drawend", (e) => {
      if (endCallback) {
        let feature = e.feature;
        feature.getGeometry().drawType = this.drawType_;
        this.currentFeatures_.push(feature);
        endCallback(e.feature);
      }

      this.removeTooltip();
    });
  }

  // 移除绘制
  removeDraw() {
    if (this.map_) {
      this.removeDrawInteraction();
      this.removeSnapInteraction();
      this.removeModifyInteraction();
      this.map_.un("pointermove", this.pointermoveHandler_);
    }
    this.removeTooltip();
  }

  //限制要素个数
  limitFeatures() {
    if (!this.layer_) {
      return;
    }
    let length = this.layer_.getSource().getFeatures().length;
    if (length >= this.maxNum_) {
      this.removeDraw();
      return `要素不能超过 ${this.MaxFeaturesNum}个 ！`;
    }
    return;
  }

  // 指定点个数
  pointNumEvent(feature, pointNum) {
    if (feature && pointNum) {
      feature.getGeometry().on("change", (evt) => {
        let geom = evt.target;
        let coordinates = geom.getCoordinates();
        if (coordinates.length > pointNum) {
          this.draw_.finishDrawing();
        }
      });
    }
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
      this.currentFeatures_.forEach((x) => {
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
    let geometryFunction;
    let type = this.drawType_;
    if (this.drawType_ == DrawType.BOX) {
      type = DrawType.CIRCLE;
      geometryFunction = createBox();
    } else if (this.drawType_ == DrawType.SQUARE) {
      type = DrawType.CIRCLE;
      geometryFunction = createRegularPolygon(4);
    }
    const source =
      this.layer_ !== undefined ? this.layer_.getSource() : undefined;
    if (type) {
      this.draw_ = new Draw({
        source,
        type,
        geometryFunction,
        stopClick: true,
      });
      this.map_.addInteraction(this.draw_);
    }
  }

  addSnapInteraction() {
    if (!this.layer_) {
      return;
    }
    this.snap_ = new Snap({
      source: this.layer_.getSource(),
    });
    this.map_.addInteraction(this.snap_);
  }

  addModifyInteraction(callback) {
    if (!this.layer_) {
      return;
    }
    this.modify_ = new Modify({
      source: this.layer_.getSource(),
      insertVertexCondition: never,
    });
    this.modify_.on("modifyend", (e) => {
      if (callback) {
        callback(e);
      }
    });
    this.map_.addInteraction(this.modify_);
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

  removeModifyInteraction() {
    if (this.modify_) {
      this.map_.removeInteraction(this.modify_);
      this.modify_ = null;
    }
  }

  removeTooltip() {
    this.sketchFeature = null;
    this.point_num = null;
    if (this.tooltip) {
      this.map_.removeOverlay(this.tooltip);
      this.tooltip = null;
    }
  }

  pointermoveHandler(e) {
    this.tooltipEvent(e.coordinate);
  }

  tooltipEvent(coordinate) {
    let content = this.getTooltipContent();
    let tooltipElement = createTooltip(content);
    if (this.tooltip) {
      this.tooltip.setElement(tooltipElement);
    } else {
      this.tooltip = new Overlay({
        element: tooltipElement,
        offset: [0, -15],
        positioning: "bottom-center",
      });
      this.map_.addOverlay(this.tooltip);
    }
    this.tooltip.setPosition(coordinate);
  }

  getTooltipContent() {
    let content = "单击，开始绘制标绘";
    if (!this.sketchFeature) {
      return content;
    }

    let fixCount = 0;
    switch (this.drawType_) {
      case DrawType.POINT:
        fixCount = 1;
        break;
      case DrawType.LINESTRING:
        fixCount = 0;
        break;
      case DrawType.POLYGON:
        fixCount = 0;
        break;
      case DrawType.CIRCLE:
        fixCount = 2;
        break;
      default:
        break;
    }
    if (this.point_num) {
      fixCount = this.point_num;
    }

    let count = this.sketchFeature.getGeometry().getCoordinates().length;

    if (!fixCount) {
      content = `标绘控制点无限制，当前为第${count}个控制点，单击继续绘制，双击结束绘制`;
      return content;
    }

    if (count < fixCount) {
      content = `标绘共有${fixCount}控制点，当前为第${count}个控制点，点击继续绘制`;
    } else if (count === fixCount) {
      content = `点击结束绘制`;
    }
    return content;
  }
}

export default DrawClass;

function createTooltip(content) {
  let tooltipElement = document.createElement("div");
  tooltipElement.className = "tooltip";
  tooltipElement.style.cssText =
    "color:#000;background: #fff;border: 1px solid #000;padding: 2px 8px;font-size: 12px;";
  tooltipElement.append(content);

  return tooltipElement;
}
