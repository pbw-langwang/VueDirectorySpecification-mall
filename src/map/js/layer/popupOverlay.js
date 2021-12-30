import Overlay from 'ol/Overlay';
import LAYER_DATA_TYPE from './layerDataType';

/**
 * 使用说明
 * let popupOverlay = PopupOverlay(id)
 * popupOverlay.setPosition(coordinate); // 指定位置弹出
 * popupOverlay.setPosition(undefined); // 隐藏位置
 *
 */

/**
 * @param  { (number | string) } overlayId
 * @returns { ol.Overlay }
 */
export default function PopupOverlay(overlayId) {
  const container = document.getElementById(overlayId);
  const overlay = new Overlay({
    id: overlayId,
    element: container,
    offset: [0, -20],
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
    layerDateType:LAYER_DATA_TYPE.OVERLAY,
  });
  return overlay;
}
