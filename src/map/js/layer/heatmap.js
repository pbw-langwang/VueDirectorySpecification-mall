import HeatMap from "ol/layer/Heatmap";
import LAYER_DATA_TYPE from './layerDataType';

/**
 * 热力图
 */
class DxHeatMap extends HeatMap {
  /**
   *
   * @param {import("ol/layer/Heatmap").Options} options
   */
  constructor(options) {
    super(options);

    this.layerDateType = LAYER_DATA_TYPE.HEATMAP;
  }
}

export default DxHeatMap;
