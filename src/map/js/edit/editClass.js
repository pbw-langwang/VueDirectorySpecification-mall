import Map from "ol/Map";
import Overlay from "ol/Overlay";

import { getPointsByFeature, updateFeature } from "./controlPoints";

const EDIT_CONTROL_POINT = "edit_control_point";

export const EDIT_TYPE = {
  CONTROL: "control", // 控制点
  VERTICES: "vertices" // 节点
};

class EditClass {
  constructor({ map, feature, type }) {
    if (map && map instanceof Map) {
      this.map = map;
    } else {
      throw new Error("传入的不是地图对象！");
    }

    if (!feature) {
      throw new Error("未传入编辑要素！");
    }

    this.mapViewport = this.map.getViewport();

    this.feature = feature;

    this.type = type || EDIT_TYPE.VERTICES; // 编辑类型

    this.ghostPoints = null; // 备份控制点坐标

    this.pointOverlays = []; // 控制点

    this.pointOverlayId = null; // 当前选中的控制点id

    this.init();
  }

  init(feature) {
    if (feature) {
      this.feature = feature;
    }

    this.initControlPoints();
  }

  destroy() {
    this.pointOverlays.forEach(x => {
      this.map.removeOverlay(x);
    });
    this.pointOverlays = [];
  }

  getControlPoints() {
    // 获取控制点
    let points = getPointsByFeature(this.feature); // 默认为节点
    if (this.type === EDIT_TYPE.CONTROL) {
      let calcCoordinates = this.feature.getGeometry().get("calcCoordinates");
      if (calcCoordinates) {
        points = calcCoordinates;
      }
    }
    return points;
  }

  initControlPoints() {
    // 获取控制点
    let points = this.getControlPoints();

    this.ghostPoints = points;

    // 根据控制点生成相应的overlay
    points.forEach((x, i) => {
      let id = `${EDIT_CONTROL_POINT}-${i}`;
      let overlay = createPointOverlay(id);
      overlay.setPosition(x.coordinate);
      overlay.data = x;
      this.pointOverlays.push(overlay);
      this.map.addOverlay(overlay);
      this.map.render();

      let element = overlay.getElement();
      element.addEventListener("mousedown", this.elementMouseDown_.bind(this));
      element.addEventListener("mouseup", this.elementMouseUp_.bind(this));
    });
  }

  elementMouseDown_(e) {
    this.pointOverlayId = e.target.id;
    this.map.on("pointermove", this.mapPointerMove_.bind(this));
  }

  elementMouseUp_(e) {
    this.pointOverlayId = null;
    this.map.un("pointermove", this.mapPointerMove_.bind(this));
  }

  mapPointerMove_(e) {
    let coordinate = e.coordinate;
    if (this.pointOverlayId) {
      let overlay = this.map.getOverlayById(this.pointOverlayId);
      if (!overlay) {
        return;
      }

      let data = overlay.data;

      if (this.type === EDIT_TYPE.CONTROL) {
        let geometry = this.feature.getGeometry();
        let fn = geometry.get("update");
        if (fn) {
          geometry = fn(geometry, data.index, coordinate);
          this.feature.setGeometry(geometry);

          let points = this.getControlPoints();
          points.forEach((x, i) => {
            let id = `${EDIT_CONTROL_POINT}-${i}`;
            let overlay = this.map.getOverlayById(id);
            overlay.setPosition(x.coordinate);
          });
          return;
        }
      }
      overlay.setPosition(coordinate);
      data.coordinate = coordinate;
      updateFeature(this.feature, data);
    }
  }
}

export default EditClass;

function createPointOverlay(id) {
  let element = document.createElement("div");
  element.id = id;
  element.className = "edit-control-point";
  element.style.cssText =
    "width: 12px; height: 12px; border: 1px solid #000; background-color: #ff0; opacity: 0.8; cursor: move;";
  return new Overlay({
    id: id,
    positioning: "center-center",
    element: element
  });
}
