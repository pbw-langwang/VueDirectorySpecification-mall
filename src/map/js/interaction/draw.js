/**
 * @ Author: Qi Zhiwu
 * @ Create Time: 2020-07-27 10:44:39
 * @ Modified by: Qi Zhiwu
 * @ Modified time: 2020-09-23 14:22:54
 * @ Description: 地图绘制交互事件
 */

/**
 * 主要是绘制功能
 * @example
 *
 * function startDraw(){ // 开始绘制
 *  let drawLayer = createVectorLayer(); // 创建绘制时的图层
 *  map.addLayer(drawLayer);
 *
 *  drawEvent({
 *       map: this.map,
 *       layer: this.layer,
 *       drawType: "Point",
 *       startCallback: () => {
 *         this.limitEvent();
 *       },
 *       endCallback: (feature) => {
 *         // 设置样式
 *         feature.setStyle(style);
 *       },
 *    });
 * }
 *
 *
 * function endDraw(){ // 结束绘制
 *  removeDrawInteraction(map);
 * }
 *
 */

import { Draw, Modify, Snap } from "ol/interaction";
import { createRegularPolygon, createBox } from "ol/interaction/Draw";
import { never } from "ol/events//condition";

let mapDraw;

let mapSnap;

let mapModify;

/**
 * 使用说明：
 * 1、调用前，需创建一个矢量图层，并添加到地图容器中
 * 2、选定几何类型，在该矢量图层的上进行绘制
 *
 * @export
 * @param {Object} params
 * @param {ol.Map} params.map
 * @param {ol.layer} params.layer
 * @param {String} params.drawType 绘制类型 'Point', 'LineString', 'Polygon', 'Circle'，'Box', 'Square'
 * @param {Function} params.startCallback, 开始绘制前的回调函数
 * @param {Function} params.endCallback, 结束绘制时的回调函数，返回绘制的要素
 * @param {Boolean} params.isOnlyEdit = false
 */
export function drawEvent({
  map,
  layer,
  drawType,
  startCallback,
  endCallback,
  isOnlyEdit = false,
}) {
  if (!map || !layer) {
    return;
  }

  // 判断是否已添加交互事件，若存在，则先移除
  removeInteraction(map);

  // 添加交互事件
  drawType = drawType || "Box"; // 默认绘制矩形的面
  if (isOnlyEdit === false) {
    addDrawInteraction(map, layer, drawType);
  }
  addSnapInteraction(map, layer);
  addModifyInteraction(map, layer);

  // 开始绘制
  mapDraw.on("drawstart", () => {
    if (startCallback) {
      startCallback();
    }
  });
  // 结束绘制
  mapDraw.on("drawend", (e) => {
    if (endCallback) {
      endCallback(e.feature);
    }
  });
}

/**
 * 添加绘制交互事件
 *
 * @param {ol.map} map 指定地图容器
 * @param {ol.layer} layer 图层
 * @param {ol/geom/GeometryType} drawType
 */
export function addDrawInteraction(map, layer, drawType) {
  let geometryFunction;
  if (drawType == "Box") {
    drawType = "Circle";
    geometryFunction = createBox();
  } else if (drawType == "Square") {
    drawType = "Circle";
    geometryFunction = createRegularPolygon(4);
  }
  const source = layer !== undefined ? layer.getSource() : undefined;
  if (drawType) {
    mapDraw = new Draw({
      source,
      type: drawType,
      geometryFunction,
      stopClick: true,
    });
    map.addInteraction(mapDraw);
  }
}

/**
 * 添加捕捉图层要素事件
 *
 * @param {ol.map} map 指定地图容器
 * @param {ol.layer} layer
 */
export function addSnapInteraction(map, layer) {
  if (!layer) {
    return;
  }
  mapSnap = new Snap({
    source: layer.getSource(),
  });
  map.addInteraction(mapSnap);
}

/**
 * 添加修改图层要素事件
 *
 * @param {ol.map} map 指定地图容器
 * @param {ol.layer} layer
 */
export function addModifyInteraction(map, layer, callback) {
  if (!layer) {
    return;
  }
  mapModify = new Modify({
    source: layer.getSource(),
    insertVertexCondition: never,
  });
  mapModify.on("modifyend", (e) => {
    if (callback) {
      callback(e);
    }
  });
  map.addInteraction(mapModify);
}

/**
 * 移除所有交互事件
 *
 * @param {ol.map} map 指定地图容器
 */
export function removeInteraction(map) {
  removeDrawInteraction(map);
  removeSnapInteraction(map);
  removeModifyInteraction(map);
}

/**
 * 移除绘制交互事件
 *
 * @param {ol.map} map 指定地图容器
 */
export function removeDrawInteraction(map) {
  if (mapDraw) {
    map.removeInteraction(mapDraw);
    mapDraw = null;
  }
}

/**
 * 移除捕捉交互事件
 *
 * @param {ol.map} map 指定地图容器
 */
export function removeSnapInteraction(map) {
  if (mapSnap) {
    map.removeInteraction(mapSnap);
    mapSnap = null;
  }
}

/**
 * 移除修改交互事件
 *
 * @param {ol.map} map 指定地图容器
 */
export function removeModifyInteraction(map) {
  if (mapModify) {
    map.removeInteraction(mapModify);
    mapModify = null;
  }
}
