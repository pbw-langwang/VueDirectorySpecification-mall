<template>
  <div class="legend-container">
    <p class="noInfo" v-if="!data || data.length == 0">暂无图例</p>
    <div class="legends" v-if="data && data.length > 0">
      <div v-for="(item, index) in data" :key="index">
        <template v-if="item.legend.length == 1">
          <img
            :src="
              `data:${item.legend[0].contentType};base64,${item.legend[0].imageData}`
            "
          />
        </template>
        <span>{{ item.layerName }}</span>
        <template v-if="item.legend.length > 1">
          <div v-for="(legend, i) in item.legend" :key="i">
            <img
              class="subImg"
              :src="`data:${legend.contentType};base64,${legend.imageData}`"
            />
            <span>{{ legend.label }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.legend-container {
  .noInfo {
    text-align: center;
  }
  .legends {
    max-height: 448px;
    overflow-y: auto;
    > div {
      line-height: 32px;
      img {
        vertical-align: middle;
        margin-right: 6px;
        &.subImg {
          margin-left: 15px;
        }
      }
    }
  }
}
</style>
