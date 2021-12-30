<script>
/**
 * 热力图
 */
import VectorBase from "./Base";
import DxHeatMap from "@map/js/layer/heatmap";

export default {
  name: "MyMapHeat",
  mixins: [VectorBase],
  props: {
    /**
     * @property {import("ol/layer/Heatmap").Options} [options] - 热力图其他参数
     */
    options: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  methods: {
    init() {
      if (this.layer) {
        return;
      }

      // 初始化数据源
      this.initSource();

      // 初始化图层
      this.layer = new DxHeatMap({
        source: this.source,
        ...this.options
      });
      this.initLayerFinish();
    }
  }
};
</script>
