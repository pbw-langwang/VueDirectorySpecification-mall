<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px"> </my-map>
    <div>
      <button @click="measureEvent('Polygon')">测面</button>
      <button @click="measureEvent('LineString')">测量</button>
      <button @click="clear">清除</button>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import Measure, { clearMeasure } from "@map/js/tool/measure";

export default {
  components: {
    MyMap
  },
  data() {
    return {
      measures: []
    };
  },
  methods: {
    measureEvent(type) {
      let map = this.$refs.mapCom.map;
      let measure = new Measure({ map, type });
      this.measures.push(measure);
    },
    clear() {
      this.measures.forEach(x => {
        clearMeasure(x);
      });
      this.measures = [];
    }
  }
};
</script>
