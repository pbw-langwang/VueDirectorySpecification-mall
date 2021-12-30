/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2021-08-30 10:14:06
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2021-09-07 16:32:58
 * @ Description: 轨迹对象，用于线的历史轨迹播放
 */

import DxVectorLayer, { getStyles } from "../layer/vectorLayer";
import GeoJSONSource from "../source/geojson";
import olMap from "ol/Map";
import Feature from "ol/Feature";
import { createDefaultStyle } from "ol/style//Style";
import { Point, LineString, MultiLineString } from "ol/geom";
import { Style, Stroke, Icon } from "ol/style";

import StartIcon from "../../assets/img/起点icon.png";
import EndIcon from "../../assets/img/终点icon.png";

/**
 *
 * 线轨迹播放类
 * @class LineTrack
 */
class LineTrack {
  /**
   * @param  { Object } options
   * @param  { import("ol/Map") } options.map 地图
   * @param  { Array<import("ol/Feature")>} options.feature 线要素
   * @param  { Number} [options.speed] = 1 速率
   * @param  { Boolean } [options.showStartAndEnd] = false 是否标注起点和终点
   * @param  { Boolean } [options.showNode] = false 是否显示节点
   * @param  { Boolean } [options.showDir] = false 是否显示方向
   * @param  { Boolean } [options.isTrack] = false 是否跟踪移动点
   * @param  { Object } [options.moveStyle] 移动电样式
   * @param  { Object } [options.nodeStyle] 节点样式
   * @param { Function } [options.callback] 移动时返回的轨迹段百分位
   */
  constructor(options) {
    options = options || {};

    this.map = options.map;
    if (!(this.map instanceof olMap)) {
      throw new Error("地图对象错误!");
    }
    this.feature = options.feature;

    if (!(this.feature instanceof Feature)) {
      throw new Error("要素对象错误!");
    }

    let geometry = this.feature.getGeometry();
    if (geometry instanceof LineString) {
      this.coordinates = geometry.getCoordinates();
    } else if (geometry instanceof MultiLineString) {
      let coordinates = geometry.getCoordinates();
      this.coordinates = coordinates[0];
      for (let i = 1; i < coordinates.length; i++) {
        const pre = coordinates[i];
        const next = coordinates[i];
        if (next[0] === pre[pre.length - 1]) {
          // 判断下一条线路的首点是否是上一条线的末点
          this.coordinates = [...this.coordinates, next];
        }
      }

      this.feature = new Feature({
        geometry: new LineString(this.coordinates)
      });
    }

    if (!Array.isArray(this.coordinates) || this.coordinates.length < 2) {
      throw new Error("线轨迹坐标格式不对!");
    }

    this.speed = options.speed || 1;

    this.showStartAndEnd = options.showStartAndEnd || false;

    this.showNode = options.showNode || false;

    this.showDir = options.showDir || false;

    this.isTrack = options.isTrack || false;

    this.moveStyle = options.moveStyle;

    this.nodeStyle = options.nodeStyle;

    this.callback = options.callback;

    this.ghostLineStyle = this.feature.getStyle();
    if (this.showDir) {
      this.feature.setStyle(trackLineStyle);
    }

    this.pointLayer = null;
    this.movePointFeature = null;

    this.animating = false;
    this.lastTime = null;
    this.distance = 0;

    this.init();

    this.moveFeatureHandler = e => {
      this.moveFeatureEvent(e);
    };
  }

  getCoordinates() {
    return this.coordinates;
  }

  getFirstCoordinate() {
    return this.coordinates[0];
  }

  getLastCoordinate() {
    return this.coordinates[this.coordinates.length - 1];
  }

  /**
   * 修改速度
   * @param { Number } value
   */
  setSpeed(value) {
    this.speed = value;
  }

  setShowStartAndEnd(value) {
    this.showStartAndEnd = value;
    if (this.showStartAndEnd) {
      this.showStartAndEndOnMap();
    } else {
      this.hideStartAndEndOnMap();
    }
  }

  /**
   * 是否显示节点
   * @param { Boolean } value
   */
  setShowNode(value) {
    this.showNode = value;
    if (this.showNode) {
      this.showNodeOnMap();
    } else {
      this.hideNodeOnMap();
    }
  }

  /**
   * 是否显示方向
   * @param { Boolean } value
   */
  setShowDir(value) {
    this.showDir = value;
    if (this.showDir) {
      this.feature.setStyle(trackLineStyle);
    } else {
      this.feature.setStyle(this.ghostLineStyle);
    }
  }

  /**
   * 是否跟踪移动点
   * @param { Boolean } value
   */
  setIsTrack(value) {
    this.isTrack = value;
  }

  init() {
    let source = new GeoJSONSource();
    // 添加移动点,初始化为路线起点
    source.addByList([
      {
        type: "Point",
        coordinates: this.coordinates[0],
        id: "track_move_point",
        pointType: "move"
      }
    ]);

    this.pointLayer = new DxVectorLayer({
      source: source
    });

    let style = feature => {
      let pointType = feature.get("pointType");
      if (pointType === "node" && this.nodeStyle) {
        return getStyles(this.nodeStyle);
      } else if (pointType === "start") {
        return getStyles({
          icon: {
            src: StartIcon
          }
        });
      } else if (pointType === "end") {
        return getStyles({
          icon: {
            src: EndIcon
          }
        });
      }
      return createDefaultStyle(feature);
    };
    this.pointLayer.setStyle(style);

    this.map.addLayer(this.pointLayer);
    this.movePointFeature = source.getFeatureById("track_move_point");

    if (this.moveStyle) {
      let style = getStyles(this.moveStyle);
      this.movePointFeature.setStyle(style);
    }

    this.showNodeOnMap();

    this.showStartAndEndOnMap();
  }

  showStartAndEndOnMap() {
    if (!this.showStartAndEnd || !this.pointLayer) {
      return;
    }

    let source = this.pointLayer.getSource();
    let list = [
      {
        type: "Point",
        coordinates: this.coordinates[0],
        id: `track_start_point`,
        pointType: "start"
      },
      {
        type: "Point",
        coordinates: this.coordinates[this.coordinates.length - 1],
        id: `track_end_point`,
        pointType: "end"
      }
    ];
    source.addByList(list);
  }

  hideStartAndEndOnMap() {
    if (this.showStartAndEnd || !this.pointLayer) {
      return;
    }

    let source = this.pointLayer.getSource();
    source.forEachFeature(f => {
      let pointType = f.get("pointType");
      if (pointType === "start" || pointType === "end") {
        source.removeFeature(f);
      }
    });
  }

  showNodeOnMap() {
    if (!this.showNode || !this.pointLayer) {
      return;
    }
    let source = this.pointLayer.getSource();
    let list = this.coordinates.map((x, i) => {
      return {
        type: "Point",
        coordinates: x,
        id: `track_node_point_${i}`,
        pointType: "node"
      };
    });
    source.addByList(list);
  }

  hideNodeOnMap() {
    if (this.showNode || !this.pointLayer) {
      return;
    }
    let source = this.pointLayer.getSource();
    source.forEachFeature(f => {
      let pointType = f.get("pointType");
      if (pointType === "node") {
        source.removeFeature(f);
      }
    });
  }

  start() {
    if (!this.pointLayer) {
      this.init();
    }

    this.animating = true;
    this.lastTime = new Date().getTime();
    this.pointLayer.on("postrender", this.moveFeatureHandler);

    this.map.render();
  }

  moveFeatureEvent(event) {
    const time = event.frameState.time;
    const elapsedTime = time - this.lastTime;
    let flag = this.distance < 1 ? false : true;
    this.distance = (this.distance + (10 * this.speed * elapsedTime) / 1e6) % 2;
    flag = this.distance < 1 ? false : true;
    this.lastTime = time;

    if (flag) {
      this.finish();
      return;
    }

    const currentCoordinate = this.feature
      .getGeometry()
      .getCoordinateAt(this.distance);
    this.movePointFeature.setGeometry(new Point(currentCoordinate));

    // 计算移动方向
    let rotation = computeMoveRotation(this.feature, this.distance);
    if (rotation) {
      let style = this.movePointFeature.getStyle();
      if (style) {
        let image = style.getImage();
        image && image.setRotation(-rotation);
      }
    }

    if (this.isTrack) {
      this.map.getView().setCenter(currentCoordinate);
    }

    this.callback && this.callback({ percent: this.distance });

    this.map.render();
  }

  pause() {
    this.animating = false;
    if (this.pointLayer) {
      this.pointLayer.un("postrender", this.moveFeatureHandler);
    }
  }

  finish() {
    this.pause();
    this.lastTime = null;
    this.distance = 0;

    let lastCoordinate = this.coordinates[this.coordinates.length - 1];
    this.movePointFeature.setGeometry(new Point(lastCoordinate));

    if (this.isTrack) {
      this.map.getView().setCenter(lastCoordinate);
    }

    this.callback && this.callback({ percent: 1 });
  }

  destroy() {
    this.finish();
    if (this.pointLayer) {
      this.map.removeLayer(this.pointLayer);
      this.pointLayer = null;
      this.movePointFeature = null;

      this.animating = false;
      this.lastTime = null;
      this.distance = 0;
    }
  }
}

export default LineTrack;

let trackLineStyle = (feature, resolution) => {
  let geometry = feature.getGeometry();
  if (!(geometry instanceof LineString)) {
    return;
  }

  let styles = [
    new Style({
      stroke: new Stroke({
        color: "green",
        width: 10
      })
    })
  ];

  let lineLength = geometry.getLength();
  let factor = (30 * resolution) / lineLength; // 30像素等分因子
  for (let i = 0; i <= 1; i += factor) {
    let arrowCoordinate = geometry.getCoordinateAt(i);
    let pre = geometry.getCoordinateAt(i - 0.0001);
    let next = geometry.getCoordinateAt(i + 0.0001);
    let dx1 = pre[0] - arrowCoordinate[0];
    let dy1 = pre[1] - arrowCoordinate[1];
    let dx2 = arrowCoordinate[0] - next[0];
    let dy2 = arrowCoordinate[1] - next[1];
    let rotation1 = Math.atan2(dy1, dx1);
    let rotation2 = Math.atan2(dy2, dx2);
    if (Math.abs(rotation1 - rotation2) < Math.PI / 180) {
      let dx = next[0] - pre[0];
      let dy = next[1] - pre[1];
      let rotation = Math.atan2(dy, dx);
      styles.push(
        new Style({
          geometry: new Point(arrowCoordinate),
          image: new Icon({
            src: require("../../assets/img/arrow.png"),
            anchor: [0.75, 0.5],
            rotateWithView: false,
            rotation: -rotation
          })
        })
      );
    }
  }
  return styles;
};

function computeMoveRotation(feature, distance) {
  const current = feature.getGeometry().getCoordinateAt(distance);
  const pre = feature.getGeometry().getCoordinateAt(distance - 0.0001);
  const next = feature.getGeometry().getCoordinateAt(distance + 0.0001);
  let dx1 = pre[0] - current[0];
  let dy1 = pre[1] - current[1];
  let dx2 = current[0] - next[0];
  let dy2 = current[1] - next[1];
  let rotation1 = Math.atan2(dy1, dx1);
  let rotation2 = Math.atan2(dy2, dx2);
  if (Math.abs(rotation1 - rotation2) < Math.PI / 180) {
    let dx = next[0] - pre[0];
    let dy = next[1] - pre[1];
    let rotation = Math.atan2(dy, dx);
    return rotation;
  }
}
