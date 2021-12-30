import Overlay from "ol/Overlay";
import LAYER_DATA_TYPE from './layerDataType';

class DxOverlay extends Overlay {
  /**
   *
   * @param {import("ol/Overlay").Options} options
   */
  constructor(options) {
    super(options);
    
    this.layerDateType = LAYER_DATA_TYPE.OVERLAY;
  }
}

export default DxOverlay;
