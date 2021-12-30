import { Vector as VectorLayer } from "ol/layer.js";
import { Vector as VectorSource } from "ol/source.js";
import { Draw } from "ol/interaction";

import { LineString, Polygon, Point } from "ol/geom.js";
import { getArea, getLength } from "ol/sphere.js";
import { unByKey } from "ol/Observable.js";
import Overlay from "ol/Overlay.js";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Feature from "ol/Feature";

/**
 * 每绘制一次，需重新实例化
 */
class Measure {
  /**
   *
   * @param {object} options
   * @param {import("ol/Map")} options.map
   * @param {string} options.type = "LineString" "LineString" || "Polygon"
   */
  constructor(options) {
    options = { ...options };

    this.map = options.map;

    this.drawType = options.type || "LineString";

    if (!this.map) {
      throw new Error("测量与绑定map对象");
    }

    // 测量图层
    this.layer = getMeasureLayer();
    this.layer.notInLayer = true;
    this.map.addLayer(this.layer);

    this.draw = null;

    /**
     * Currently drawn feature.
     * @type {module:ol/Feature~Feature}
     */
    this.sketch = null;

    this.listener = null;

    /**
     * Overlay to show the help messages.
     * @type {module:ol/Overlay}
     */
    this.helpTip = null;
    this.measureTips = [];

    this.pointerMoveHandler_ = (e) => {
      this.pointerMoveHandler(e);
    };

    this.start();
  }

  getMap() {
    return this.map;
  }

  getLayer() {
    return this.layer;
  }

  getTips() {
    return this.measureTips;
  }

  getDraw() {
    return this.draw;
  }

  start() {
    this.addDrawInteraction();

    this.map.on("pointermove", this.pointerMoveHandler_);

    // 鼠标右键，结束绘制
    document.oncontextmenu = () => {
      this.draw.finishDrawing();
      this.end();
    };
  }

  end() {
    if (this.draw) {
      this.draw.finishDrawing();
    }

    this.removeDrawInteraction();

    this.map.un("pointermove", this.pointerMoveHandler_);

    // 取消右键事件
    document.oncontextmenu = function() {
      return false;
    };
  }

  addDrawInteraction() {
    this.draw = getMeasureDraw({
      type: this.drawType,
      source: this.layer.getSource(),
    });
    this.map.addInteraction(this.draw);

    this.draw.on("drawstart", (e) => {
      this.sketch = e.feature;
      let geom = this.sketch.getGeometry();
      if (geom instanceof LineString) {
        this.lineHandler(geom);
      }
    });

    this.draw.on("drawend", () => {
      if (this.measureTips) {
        let last = this.measureTips.pop();
        last && this.map.removeOverlay(last);
      }

      let geom = this.sketch.getGeometry();
      this.addMeasureTip(geom, true);

      this.sketch = null;

      unByKey(this.listener);

      this.end();
    });
  }

  removeDrawInteraction() {
    if (this.draw) {
      this.map.removeInteraction(this.draw);
      this.draw = null;
    }
    if (this.helpTip) {
      this.map.removeOverlay(this.helpTip);
    }
  }

  /**
   * 鼠标移动时的事件
   * @param {module:ol/MapBrowserEvent~MapBrowserEvent} e The event.
   */
  pointerMoveHandler(e) {
    if (e.dragging) {
      return;
    }

    let helpMsg = "单击绘制起点";
    if (this.sketch) {
      let output = null;
      let prefix = "";
      let geom = this.sketch.getGeometry();
      if (geom instanceof Polygon) {
        output = formatArea(e.map, geom);
        prefix = "总面积";
      } else if (geom instanceof LineString) {
        output = formatLength(e.map, geom);
        prefix = "总长度";
      }
      let continueMsg = "单击继续，双击或右键结束";

      helpMsg =
        `<div>${prefix}：<span style="color:#FE383A;font-weight:bold">${output.value}</span>  ${output.unit}</div>` +
        `<div>${continueMsg}</div>`;
    }

    let coordinate = e.coordinate || e.map.getEventCoordinate(e.originalEvent);
    if (this.helpTip) {
      this.helpTip.setPosition(coordinate);
      this.helpTip.getElement().innerHTML = helpMsg;
    } else {
      let element = document.createElement("div");
      element.textContent = helpMsg;
      this.helpTip = this.addOverlay_(element, coordinate);
    }
  }

  /**
   * 线处理
   */
  lineHandler(geom) {
    let points = []; // 有效、固定的坐标数
    let sketch_point_num = 0; // 绘制中的坐标数
    let lineFeature = null; // 已绘制的线要素
    this.listener = geom.on("change", () => {
      let coordinates = geom.getCoordinates();
      let len = coordinates.length;
      if (sketch_point_num < len) {
        // 绘制中
        sketch_point_num = len;
        if (points.length !== len - 1) {
          // 将固定的倒数第一个数加入
          let coordinate = coordinates[len - 2];
          points.push(coordinate);
          let point = new Point(coordinate);
          this.layer.getSource().addFeature(new Feature(point));

          if (points.length === 1) {
            let element = document.createElement("div");
            element.textContent = "起点";
            this.addMeasureTipByContent(point, element);
          } else {
            let geometry = new LineString(points);
            if (lineFeature) {
              lineFeature.setGeometry(geometry);
            } else {
              lineFeature = new Feature(geometry);
              this.layer.getSource().addFeature(lineFeature);
            }

            this.addMeasureTip(lineFeature.getGeometry());
          }
        }
      }
    });
  }

  addMeasureTip(geometry, isDelete = false) {
    let output = null;
    if (geometry instanceof LineString) {
      output = formatLength(this.map, geometry);
    } else if (geometry instanceof Polygon) {
      output = formatArea(this.map, geometry);
    }

    let element = document.createElement("div");
    element.textContent = `${output.value} ${output.unit}`;

    let overlay = this.addMeasureTipByContent(geometry, element);
    if (isDelete) {
      let deleteElement = document.createElement("span");
      deleteElement.textContent = "✖";
      deleteElement.style.cssText =
        "margin-left:5px;font-weight: bold;cursor:pointer";
      deleteElement.onclick = () => {
        this.layer.getSource().clear();
        this.map.removeLayer(this.layer);

        // 删除弹出框
        for (let i = 0; i < this.measureTips.length; i++) {
          this.map.removeOverlay(this.measureTips[i]);
        }
        this.measureTips = [];
      };
      element.appendChild(deleteElement);
      overlay.getElement().appendChild(element);
    }
  }

  addMeasureTipByContent(geometry, element) {
    let coordinate = null;
    if (geometry instanceof Point) {
      coordinate = geometry.getLastCoordinate();
    } else if (geometry instanceof LineString) {
      coordinate = geometry.getLastCoordinate();
    } else if (geometry instanceof Polygon) {
      coordinate = geometry.getInteriorPoint().getCoordinates();
    }

    let overlay = this.addOverlay_(element, coordinate);
    this.measureTips.push(overlay);
    return overlay;
  }

  addOverlay_(element, coordinate, id) {
    let container = document.createElement("div");
    container.className = "measure-tip";
    container.style.cssText =
      "background: #fff;border: 1px solid #000;padding: 2px 8px;";
    container.appendChild(element);

    let overlay = new Overlay({
      id: id || new Date().getTime(),
      element: container,
      offset: [0, -15],
      positioning: "bottom-center",
      position: coordinate,
    });
    this.map.addOverlay(overlay);
    return overlay;
  }
}

export default Measure;

/**
 * 清楚测量
 * @param {Measure} measure
 */
export function clearMeasure(measure) {
  if (measure) {
    measure.end();
    let map = measure.getMap();
    let layer = measure.getLayer();
    let overlays = measure.getTips();
    layer && map.removeLayer(layer);
    overlays &&
      overlays.forEach((x) => {
        map.removeOverlay(x);
      });
  }
}

/**
 * 求LineString长度
 *
 * @param {ol/geom/LineString~LineString} line
 * @returns {string} The formatted length.
 */
function formatLength(map, line) {
  let proj = map
    .getView()
    .getProjection()
    .getCode();
  let length = getLength(line, {
    projection: proj,
  });
  let value = 0;
  let unit = "";
  if (length > 100) {
    value = Math.round((length / 1000) * 100) / 100;
    unit = "km";
  } else {
    value = Math.round(length * 100) / 100;
    unit = "m";
  }
  return { value, unit };
}

/**
 *求polygon的面积
 *
 * @param {ol/geom/Polygon~Polygon} polygon
 * @returns {string} Formatted area
 */
function formatArea(map, polygon) {
  let proj = map
    .getView()
    .getProjection()
    .getCode();
  let area = getArea(polygon, {
    projection: proj,
  });
  let value = 0;
  let unit = "";
  if (area > 10000) {
    value = Math.round((area / 1000000) * 100) / 100;
    unit = "k㎡";
  } else {
    value = Math.round(area * 100) / 100;
    unit = "㎡";
  }
  return { value, unit };
}

/**
 * 初始化绘制图层
 * @returns {Object} layer
 */
function getMeasureLayer() {
  let layer = new VectorLayer({
    source: new VectorSource(),
    style: new Style({
      stroke: new Stroke({
        color: "#f00",
        width: 4,
      }),
      fill: new Fill({
        color: "rgba(255,255,255,0.3)",
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "#f00",
        }),
        fill: new Fill({
          color: "#fff",
        }),
      }),
    }),
    zIndex: 99999999999,
  });
  layer.name = "measure";
  return layer;
}

/**
 * 初始化绘制对象
 * @param  {module:ol/vector/source} source
 * @param  {String} type "Polygon" | "LineString"
 * @returns {Object | null} draw
 */
function getMeasureDraw({ source, type }) {
  let draw = new Draw({
    source: source,
    type: type == "Polygon" ? "Polygon" : "LineString",
    style: new Style({
      fill: new Fill({
        color: "rgba(255, 255, 255, 0.3)",
      }),
      stroke: new Stroke({
        color: "#43a5fa",
        width: 2,
      }),
      image: new CircleStyle({
        radius: 5,
        stroke: new Stroke({
          color: "#43a5fa",
        }),
        fill: new Fill({
          color: "#43a5fa",
        }),
      }),
    }),
  });
  draw.getOverlay().setZIndex(99999999998);
  return draw;
}
