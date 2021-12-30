<template>
  <div class="my-map-timeLine" :class="[vertical ? 'vertical' : 'horizontal']">
    <el-timeline>
      <el-timeline-item
        v-for="(item, i) in dates"
        :key="i"
        :timestamp="item"
        :color="i === index ? '#0000FF' : null"
        placement="top"
      >
      </el-timeline-item>
    </el-timeline>
    <div class="btn">
      <i
        v-if="!isPlay"
        class="icon el-icon-video-play"
        @click="intervalEvent"
      ></i>
      <i
        v-if="isPlay"
        class="icon el-icon-video-pause"
        @click="clearIntervalEvent"
      ></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "MyMapTimeLine",
  inject: ["myMap"],
  props: {
    dates: {
      type: Array,
      default: () => {
        return [];
      }
    },
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    vertical: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      index: 0,
      timer: null,
      layer: null,
      isPlay: false
    };
  },
  mounted() {
    this.myMap.mapReady(this.init);
  },
  beforeDestroy() {
    this.disposed();
  },
  methods: {
    init() {
      this.isPlay = true;
      this.handler();
      this.intervalEvent();
    },
    intervalEvent() {
      let len = this.dates.length;
      if (len === 0) {
        return;
      }

      this.isPlay = true;

      this.timer = setInterval(() => {
        if (this.index && this.index == len - 1) {
          this.index = 0;
        } else {
          this.index++;
        }
        this.handler();
      }, this.interval);
    },
    clearIntervalEvent() {
      this.isPlay = false;
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    async handler() {
      if (!this.data || !this.dates) {
        return;
      }

      let map = this.myMap.map;
      if (!map) {
        return;
      }
      if (this.layer) {
        map.removeLayer(this.layer);
      }

      let params = this.data[this.index];
      if (params) {
        this.layer = await map.addImageLayer(params);
      }
    },
    disposed() {
      this.index = 0;
      this.clearIntervalEvent();
      let map = this.myMap.map;
      if (map && this.layer) {
        map.removeLayer(this.layer);
        this.layer = null;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.my-map-timeLine {
  z-index: 1;
  position: absolute;

  /deep/ .el-timeline {
    .el-timeline-item {
      .el-timeline-item__wrapper {
        .el-timeline-item__timestamp {
          background-color: #e4e7ed;
          padding: 5px;
          color: #000;
        }
      }
    }
  }

  .btn {
    .icon {
      font-size: 28px;
    }
  }

  &.vertical {
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  &.horizontal {
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    display: flex;
    /deep/ .el-timeline {
      .el-timeline-item {
        float: left;
        padding-right: 20px;
        padding-bottom: unset;
        .el-timeline-item__tail {
          border-top: 2px solid #e4e7ed;
          top: 4px;
          width: 100%;
          border-left: unset;
          left: unset;
          height: unset;
        }
        .el-timeline-item__wrapper {
          padding-top: 28px;
          padding-left: unset;
        }
      }
    }
  }
}
</style>
