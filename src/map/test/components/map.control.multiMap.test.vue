<template>
  <div>
    <div class="container">
      <MyMapMultiMap
        ref="multiMap"
        :num="num"
        :layers="layers"
        :col="col"
      ></MyMapMultiMap>
    </div>
    <div>
      <button @click="changeNum(1)">1个地图</button>
      <button @click="changeNum(2)">2个地图</button>
      <button @click="changeNum(3)">3个地图</button>
      <button @click="changeNum(4)">4个地图</button>
      <button @click="changeLastLayer">修改最后一个地图</button>
      <button @click="changeCol(1)">1列</button>
      <button @click="changeCol(2)">2列</button>
      <button @click="changeCol(3)">3列</button>
      <button @click="changeCol(4)">4列</button>
    </div>
  </div>
</template>

<script>
import MyMapMultiMap from "@map/components/my-map/MultiMap.vue";

export default {
  components: {
    MyMapMultiMap
  },
  data() {
    return {
      num: 1,
      col: 0,
      layers: [
        {
          name: "123",
          data: [
            {
              type: "xyz",
              url:
                "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
              projection: "EPSG:3857"
            },
            {
              type: "xyz",
              url:
                "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
              projection: "EPSG:3857"
            }
          ]
        },
        {
          name: "13413515",
          data: [
            {
              type: "xyz",
              url:
                "http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
              projection: "EPSG:3857"
            }
          ]
        },
        {
          name: "131434",
          data: [
            {
              type: "xyz",
              url:
                "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
              projection: "EPSG:3857"
            }
          ]
        },
        {
          name: "afad",
          data: [
            {
              type: "xyz",
              url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              projection: "EPSG:3857"
            }
          ]
        }
      ]
    };
  },
  methods: {
    changeNum(value) {
      this.num = value;
    },
    changeLastLayer() {
      let list = {
        name: "dag",
        data: [
          {
            type: "xyz",
            url:
              "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
            projection: "EPSG:3857"
          }
        ]
      };
      this.$refs.multiMap.updateMapByIndex(this.num - 1, list);
    },
    changeCol(val) {
      this.col = val;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1700px;
  height: 800px;
  position: relative;
}
</style>
