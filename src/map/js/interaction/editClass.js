import { Map, Overlay, Feature } from "ol";
import DragPan from "ol/interaction/DragPan";
import controlPointsFeature from "./controlPoints";

const BASE_HELP_CONTROL_POINT_ID = "p-helper-control-point-div";

class EditClass {
  constructor(map) {
    if (map && map instanceof Map) {
      this.map = map;
    } else {
      throw new Error("传入的不是地图对象！");
    }
    /**
     * 当前地图容器
     * @type {Element}
     */
    this.mapViewport = this.map.getViewport();
    this.layer = null;
    this.activeFeature = null;

    /**
     * 开始点
     * @type {null}
     */
    this.startPoint = null;
    /**
     * clone的控制点
     * @type {null}
     */
    this.ghostControlPoints = null;
    /**
     * 控制点
     * @type {null}
     */
    this.controlPoints = null;
    /**
     * 鼠标移入
     * @type {boolean}
     */
    this.mouseOver = false;
    /**
     * 元素
     * @type {{}}
     */
    this.elementTable = {};
    /**
     * 当前激活的控制点的ID
     * @type {null}
     */
    this.activeControlPointId = null;
    /**
     * 地图拖拽交互
     * @type {null}
     */
    this.mapDragPan = null;
    /**
     * 未激活之前鼠标样式
     * @type {null}
     * @private
     */
    this.previousCursor_ = null;

    // 函数上下文的绑定
    // 控制点
    this.controlPointMouseDownHandler_ = (e) => {
      this.controlPointMouseDownHandler(e);
    };
    this.controlPointMouseMoveHandler2_ = (e) => {
      this.controlPointMouseMoveHandler2(e);
    };
    this.controlPointMouseUpHandler_ = () => {
      this.controlPointMouseUpHandler();
    };
    this.controlPointMouseMoveHandler_ = (e) => {
      this.controlPointMouseMoveHandler(e);
    };

    // 要素
    this.featureMouseOverOutHandler_ = (e) => {
      this.featureMouseOverOutHandler(e);
    };

    this.featureMouseDownHandler_ = (e) => {
      this.featureMouseDownHandler(e);
    };

    this.featureMouseUpHandler_ = (e) => {
      this.featureMouseUpHandler(e);
    };

    this.featureMouseMoveHandler_ = (e) => {
      this.featureMouseMoveHandler(e);
    };
  }

  getLayer() {
    return this.layer;
  }

  getFeature() {
    return this.activeFeature;
  }

  active(layer, feature) {
    if (
      feature &&
      feature instanceof Feature &&
      feature !== this.activeFeature
    ) {
      this.deactivate();
      this.layer = layer;
      this.activeFeature = new controlPointsFeature(feature);
      this.previousCursor_ = this.map.getTargetElement().style.cursor;
      this.map.on("pointermove", this.featureMouseOverOutHandler_);
      this.initControlPoints();
    }
  }

  initControlPoints() {
    this.controlPoints = [];
    let cPnts = this.activeFeature.getPoints();
    this.ghostControlPoints = cPnts;
    if (cPnts && Array.isArray(cPnts) && cPnts.length > 0) {
      cPnts.forEach((item, index) => {
        let id = `${BASE_HELP_CONTROL_POINT_ID}-${index}`;
        this.elementTable[id] = index;
        let element = document.createElement("div");
        element.id = id;
        element.style.cssText =
          "width: 20px;height: 20px;border: 1px solid #000;background-color: #ff0;opacity: 0.8;cursor: move;";
        let pnt = new Overlay({
          id: id,
          position: cPnts[index],
          positioning: "center-center",
          element: element,
        });
        this.controlPoints.push(pnt);
        this.map.addOverlay(pnt);
        this.map.render();
        element.addEventListener(
          "mousedown",
          this.controlPointMouseDownHandler_,
          true
        );
        element.addEventListener(
          "mousemove",
          this.controlPointMouseMoveHandler2_,
          true
        );
        element.addEventListener(
          "touchstart",
          this.controlPointMouseDownHandler_,
          true
        );
        // element.addEventListener(
        //   "touchmove",
        //   this.controlPointMouseMoveHandler2_,
        //   true
        // );
      });
    }
  }

  controlPointMouseMoveHandler2(e) {
    e.stopImmediatePropagation();
  }

  controlPointMouseDownHandler(e) {
    e.preventDefault();
    this.activeControlPointId = e.target.id;
    // this.map.on("pointermove", this.controlPointMouseMoveHandler_);
    this.map.mapBrowserEventHandler_.addEventListener(
      "pointermove",
      this.controlPointMouseMoveHandler_
    );
    this.mapViewport.addEventListener(
      "mouseup",
      this.controlPointMouseUpHandler_
    );
    this.mapViewport.addEventListener(
      "touchend",
      this.controlPointMouseUpHandler_
    );
  }

  controlPointMouseMoveHandler(e) {
    let coordinate = e.coordinate;
    if (this.activeControlPointId) {
      let index = this.elementTable[this.activeControlPointId];
      this.activeFeature.updatePoint(coordinate, index);

      let overlay = this.map.getOverlayById(this.activeControlPointId);
      if (overlay) {
        overlay.setPosition(coordinate);
      }
    }
  }

  controlPointMouseUpHandler() {
    this.activeControlPointId = null;
    // this.map.un("pointermove", this.controlPointMouseMoveHandler_);
    this.map.mapBrowserEventHandler_.removeEventListener(
      "pointermove",
      this.controlPointMouseMoveHandler_
    );
    this.mapViewport.removeEventListener(
      "mouseup",
      this.controlPointMouseUpHandler_,
      true
    );
    this.mapViewport.removeEventListener(
      "touchend",
      this.controlPointMouseUpHandler_,
      true
    );
  }

  removeControlOverlays() {
    Object.keys(this.elementTable).forEach((id) => {
      let element = document.getElementById(id);
      if (element) {
        element.removeEventListener(
          "mousedown",
          this.controlPointMouseDownHandler_,
          true
        );
        element.removeEventListener(
          "mousemove",
          this.controlPointMouseMoveHandler2_,
          true
        );
        element.removeEventListener(
          "touchstart",
          this.controlPointMouseDownHandler_,
          true
        );
        // element.removeEventListener(
        //   "touchmove",
        //   this.controlPointMouseMoveHandler2_,
        //   true
        // );
      }
      let overlay = this.map.getOverlayById(id);
      this.map.removeOverlay(overlay);
    });
  }

  deactivate() {
    this.activeFeature = null;
    this.mouseOver = false;
    this.map.getTargetElement().style.cursor = this.previousCursor_;
    this.previousCursor_ = null;
    this.disconnectEventHandlers();
    this.enableMapDragPan();
    this.removeControlOverlays();
    this.elementTable = {};
    this.activeControlPointId = null;
    this.controlPoints = null;
    this.startPoint = null;
    this.ghostControlPoints = null;
  }

  featureMouseOverOutHandler(e) {
    let feature = this.map.forEachFeatureAtPixel(e.pixel, function(feature) {
      return feature;
    });
    if (feature && feature === this.activeFeature.getFeature()) {
      if (!this.mouseOver) {
        this.mouseOver = true;
        this.map.getTargetElement().style.cursor = "move";
        this.map.on("pointerdown", this.featureMouseDownHandler_);
      }
    } else {
      if (this.mouseOver) {
        this.mouseOver = false;
        this.map.getTargetElement().style.cursor = "default";
        this.map.un("pointerdown", this.featureMouseDownHandler_);
      }
    }
    return feature;
  }

  featureMouseDownHandler(e) {
    this.ghostControlPoints = this.activeFeature.getPoints();
    this.startPoint = e.coordinate;
    this.disableMapDragPan();
    this.map.on("pointerup", this.featureMouseUpHandler_);
    this.map.on("pointerdrag", this.featureMouseMoveHandler_);
  }

  featureMouseMoveHandler(e) {
    let [deltaX, deltaY, newPoints] = [
      e.coordinate[0] - this.startPoint[0],
      e.coordinate[1] - this.startPoint[1],
      [],
    ];
    if (
      this.ghostControlPoints &&
      Array.isArray(this.ghostControlPoints) &&
      this.ghostControlPoints.length > 0
    ) {
      for (let i = 0; i < this.ghostControlPoints.length; i++) {
        let coordinate = [
          this.ghostControlPoints[i][0] + deltaX,
          this.ghostControlPoints[i][1] + deltaY,
        ];
        newPoints.push(coordinate);
        let id = `${BASE_HELP_CONTROL_POINT_ID}-${i}`;
        let overlay = this.map.getOverlayById(id);
        if (overlay) {
          overlay.setPosition(coordinate);
          overlay.setPositioning("center-center");
        }
      }
    }
    this.activeFeature.updatePoints(newPoints);
  }

  featureMouseUpHandler() {
    this.enableMapDragPan();
    this.map.un("pointerup", this.featureMouseUpHandler_);
    this.map.un("pointerdrag", this.featureMouseMoveHandler_);
  }

  disconnectEventHandlers() {
    this.map.un("pointermove", this.featureMouseOverOutHandler_);
    // this.map.un("pointermove", this.controlPointMouseMoveHandler_);
    this.map.mapBrowserEventHandler_.removeEventListener(
      "pointermove",
      this.controlPointMouseMoveHandler_
    );
    this.mapViewport.removeEventListener(
      "mouseup",
      this.controlPointMouseUpHandler_,
      true
    );
    this.mapViewport.removeEventListener(
      "touchend",
      this.controlPointMouseUpHandler_,
      true
    );
    this.map.un("pointerdown", this.featureMouseDownHandler_);
    this.map.un("pointerup", this.featureMouseUpHandler_);
    this.map.un("pointerdrag", this.featureMouseMoveHandler_);
  }

  /**
   * 禁止地图的拖拽平移
   */
  disableMapDragPan() {
    let interactions = this.map.getInteractions().getArray();
    interactions.every((item) => {
      if (item instanceof DragPan) {
        this.mapDragPan = item;
        this.map.removeInteraction(item);
        return false;
      } else {
        return true;
      }
    });
  }

  /**
   * 激活地图的拖拽平移
   */
  enableMapDragPan() {
    if (this.mapDragPan && this.mapDragPan instanceof DragPan) {
      this.map.addInteraction(this.mapDragPan);
      this.mapDragPan = null;
    }
  }
}

export default EditClass;
