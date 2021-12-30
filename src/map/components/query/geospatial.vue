<script>
import SelectShape from "@map/js/edit/select_shape";

export default {
  name: "MyMapQuerySpatial",
  inject: ["myMap"],
  render() {
    return null;
  },
  props: ["layerItem"],
  data() {
    return {
      select: null
    };
  },
  methods: {
    draw({ type, callback }) {
      this.select = null;
      let map = this.myMap.map;
      if (!map) {
        return;
      }

      let projection = map.getView().getProjection();
      this.select = new SelectShape({
        map: map,
        drawType: type,
        callback: feature => {
          callback(feature, projection);
          this.select.destroy();
        }
      });
    }
  }
};
</script>
