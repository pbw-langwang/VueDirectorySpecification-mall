<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px"></my-map>
    <div>
      <button @click="addStamenLayer('toner')">toner</button>
      <button @click="addStamenLayer('toner-hybrid')">toner-hybrid</button>
      <button @click="addStamenLayer('toner-labels')">toner-labels</button>
      <button @click="addStamenLayer('toner-lines')">toner-lines</button>
      <button @click="addStamenLayer('toner-background')">
        toner-background
      </button>
      <button @click="addStamenLayer('toner-lite')">toner-background</button>
    </div>
    <div>
      <button @click="addStamenLayer('terrain')">terrain</button>
      <button @click="addStamenLayer('terrain-labels')">terrain-labels</button>
      <button @click="addStamenLayer('terrain-lines')">terrain-lines</button>
      <button @click="addStamenLayer('terrain-background')">
        terrain-background
      </button>
    </div>
    <div>
      <button @click="addStamenLayer('watercolor')">watercolor</button>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";

export default {
  components: {
    MyMap
  },
  mounted() {
    // this.addStamenLayer();
  },
  methods: {
    async addStamenLayer(value) {
      this.$refs.mapCom.map.clearBaseLayer();
      this.$refs.mapCom.map.clear();
      let params = {
        type: "stamen",
        layers: value,
        id: "1" // 用于查找图层
      };
      await this.$refs.mapCom.map.addImageLayer(params);
      this.$refs.mapCom.map.getView().setZoom(2);
    }
  }
};
</script>
