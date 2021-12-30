/**
 * 使用说明
 * 坐标定位 gotoCoordinate(map,[0,0]); // 当前视图坐标系
 * 范围或几何体定位 gotoGeomtryOrExtent(map,[0,0,100000,100000]) // 当前视图坐标系
 * 放大 zoomIn(map);
 * 缩小 zoomOut(map);
 * 全屏 toggleFullScreen(element);
 * 左旋转 rotate(map,"left",Math.PI/2);
 * 右旋转 rotate(map,"right",Math.PI/2);
 *
 */

/**
 * 地图定位到指定的坐标位置，坐标采用ol.view定义的坐标系
 * @param {ol.Map} map
 * @param {ol.Coordinate} coordinate
 * @param { Number } zoom  默认为视图的当前级别
 */
export function gotoCoordinate(map, coordinate, zoom) {
  let currentZoom = zoom !== undefined ? zoom : map.getView().getZoom();
  //map.getView().setCenter(coordinate);
  map.getView().animate({ center: coordinate }, { zoom: currentZoom });
}

/**
 * 定位到指定的点、线、面等简单几何体或者范围
 * 默认缩放到最大18级
 * @param  { ol.Map } map
 * @param  { ol.geom.SimpleGeometry | ol.extent } geometryOrExtent
 */
export function gotoGeomtryOrExtent(map, geometryOrExtent) {
  let maxZoom = map.getView().getMaxZoom();
  let value = maxZoom < 19 ? maxZoom : 18;
  map.getView().fit(geometryOrExtent, { maxZoom: value });
}

/**
 * 地图放大一级
 * @param  { ol.Map } map
 * @returns { {status:boolean,message:string}} 操作信息
 */
export function zoomIn(map) {
  var currentZoom = map.getView().getZoom();
  var maxZoom = map.getView().getMaxZoom();
  maxZoom = maxZoom ? maxZoom : 18;
  if (currentZoom < maxZoom) {
    map.getView().setZoom(currentZoom + 1);
    return { status: true, message: "已成功放大了一级。" };
  } else {
    return { status: false, message: "已是最大级别，无法再放大了！" };
  }
}

/**
 * 地图缩小一级
 * @param  { ol.Map } map
 * @returns { {status:boolean,message:string}} 操作信息
 */
export function zoomOut(map) {
  var currentZoom = map.getView().getZoom();
  var minZoom = map.getView().getMinZoom();
  minZoom = minZoom ? minZoom : 3;
  if (currentZoom >= minZoom) {
    map.getView().setZoom(currentZoom - 1);
    return { status: true, message: "已成功缩小了一级。" };
  } else {
    return { status: false, message: "已是最小级别，无法再缩小了！" };
  }
}

/**
 * 根据方向、角度旋转旋转
 *
 * @param { ol.Map } map
 * @param {string} direction = "right"  ("right" || "left" )
 * @param {number} angle = Math.PI / 6
 * @param {boolean} [isRel=true] 是否是相对角度
 */
export function rotate(map, direction, angle, isRel = true) {
  var dir = direction !== undefined ? direction : "right";
  var value = angle !== undefined ? angle : Math.PI / 6;
  var rotation = map.getView().getRotation();
  var rotate = rotation;
  if (isRel == true) {
    if (dir == "right") {
      rotate += value;
    } else {
      rotate -= value;
    }
  } else {
    rotate = value;
  }
  map.getView().setRotation(rotate);
}

/**
 * 切换全屏
 *
 * @param { HTMLElement } element
 */
export function toggleFullScreen(element) {
  handleFullScreen_(element);
}

function handleFullScreen_(element) {
  element = element || window.top.document.body;
  if (!isFullScreenSupported(element)) {
    return;
  }

  if (isFullScreen()) {
    exitFullScreen();
  } else {
    requestFullScreen(element);
  }
}

/**
 * @return {boolean} Fullscreen is supported by the current platform.
 */
function isFullScreenSupported(element) {
  let document = window.top.document;
  return !!(
    element.webkitRequestFullscreen ||
    (element.mozRequestFullScreen && document.mozFullScreenEnabled) ||
    (element.msRequestFullscreen && document.msFullscreenEnabled) ||
    (element.requestFullscreen && document.fullscreenEnabled)
  );
}

/**
 * @return {boolean} Element is currently in fullscreen.
 */
export function isFullScreen() {
  let document = window.top.document;
  return !!(
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    document.fullscreenElement
  );
}

/**
 * Request to fullscreen an element.
 * @param {HTMLElement} element Element to request fullscreen
 */
function requestFullScreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

/**
 * Exit fullscreen.
 */
function exitFullScreen() {
  let document = window.top.document;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

/**
 * 根据比例尺分母，调整视图
 * @param  {Map} map
 * @param  {Number} scale
 * @param {Array(x,y)} center
 */
export function setResolutionByScale(map, scaleDenominator, center) {
  if (!map || !scaleDenominator) {
    return;
  }
  let metersPerUnit = map
    .getView()
    .getProjection()
    .getMetersPerUnit();

  let r = scaleDenominator / metersPerUnit / (96 / 0.0254); //  计算出分辨率
  map.getView().setResolution(r);

  if (center) {
    map.getView().setCenter(center);
  }
}

/**
 * 根据地图获取当前的比例尺分母
 * @param  {ol.map} map
 * @returns {Number} 比例尺分母
 */
export function getScaleDenominatorByResolution(map) {
  if (!map) {
    return;
  }

  let view = map.getView();
  let metersPerUnit = view.getProjection().getMetersPerUnit();
  let resolution = view.getResolution();
  let scaleDenominators = resolution * metersPerUnit * (96 / 0.0254);
  return scaleDenominators;
}

/**
 * 根据视图获取当前的比例尺分母
 * @param  {ol.view} view
 * @returns {Number} 比例尺分母
 */
export function getScaleDenominatorByView(view) {
  if (!view) {
    return;
  }

  let metersPerUnit = view.getProjection().getMetersPerUnit();
  let resolution = view.getResolution();
  let scaleDenominators = resolution * metersPerUnit * (96 / 0.0254);
  return scaleDenominators;
}
