<template>
  <div>
    <my-map ref="mapCom" style="width: 1500px; height: 800px">
      <MyMapVectorJson ref="geo" :dataSource="dataSource"> </MyMapVectorJson>
    </my-map>
    <div>
      <button @click="showStartAndEndEvent">显示起点和终点</button>
      <button @click="showNodeEvent">显示节点</button>
      <button @click="updateSpeed">5倍速度</button>
      <button @click="changeIsTrack">是否跟踪移动点</button>
      <button @click="showDirEvent">显示方向</button>
      <button @click="start">开始</button>
      <button @click="pause">暂停</button>
      <button @click="finish">结束</button>
      <button @click="close">关闭</button>
      <span>百分位：{{ percent }}</span>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapVectorJson from "@map/components/my-map-vector/Json";
import Track from "@map/js/animation/track";

export default {
  components: {
    MyMap,
    MyMapVectorJson
  },
  data() {
    return {
      dataSource: {
        type: "1",
        data: [
          {
            type: "LineString",
            coordinates: [
              [110, 31.58],
              [110.2, 31.68],
              [110.2, 31.48],
              [110.4, 31.68],
              [110.4, 31.48],
              [110.6, 31.68],
              [110.6, 31.48],
              [110.8, 31.68],
              [110.8, 31.48],
              [111, 31.58]
            ],
            id: "track_1"
          }
        ]
      },
      track: null,
      showStartAndEnd: false,
      showNode: false,
      isTrack: false,
      showDir: false,
      percent: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let feature = this.$refs.geo.source.getFeatureById("track_1");
      if (!feature) {
        return;
      }
      this.track = new Track({
        map: this.$refs.mapCom.map,
        feature: feature,
        moveStyle: {
          icon: {
            src: require("../../assets/img/car.png")
          }
          // circle: {
          //   radius: 7,
          //   fill: { color: "black" },
          //   stroke: {
          //     color: "white",
          //     width: 2,
          //   },
          // },
        },
        callback: data => {
          this.percent = data.percent;
        }
      });
    },
    showStartAndEndEvent() {
      this.showStartAndEnd = !this.showStartAndEnd;
      this.track && this.track.setShowStartAndEnd(this.showStartAndEnd);
    },
    showNodeEvent() {
      this.showNode = !this.showNode;
      this.track && this.track.setShowNode(this.showNode);
    },
    changeIsTrack() {
      this.isTrack = !this.isTrack;
      this.track && this.track.setIsTrack(this.isTrack);
    },
    updateSpeed() {
      this.track && this.track.setSpeed(5);
    },
    showDirEvent() {
      this.showDir = !this.showDir;
      this.track && this.track.setShowDir(this.showDir);
    },
    start() {
      this.track && this.track.start();
    },
    pause() {
      this.track && this.track.pause();
    },
    finish() {
      this.track && this.track.finish();
    },
    close() {
      this.track && this.track.destroy();
    }
  }
};
</script>
