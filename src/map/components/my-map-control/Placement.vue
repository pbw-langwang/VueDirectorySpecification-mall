<template>
  <div class="my-map-placement" :class="classes" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MyMapPlacement",
  /**
   * 参数属性
   * @member props
   * @property {string} [placement] 停泊位置，可选值'left-top', 'center-top', 'right-top'，'left-center', 'center-center', 'right-center''left-bottom', 'center-bottom', 'right-bottom'
   * @property {number} [zIndex]=1 层级
   * @property {number[]} [margin] 外边距
   * @property {string[]} [theme] 主题 可选值 'default', 'light', 'dark'
   */
  props: {
    // 停泊位置
    placement: {
      type: String,
      default: "left-bottom",
      validator(val) {
        return [
          "left-top",
          "center-top",
          "right-top",
          "left-center",
          "center-center",
          "right-center",
          "left-bottom",
          "center-bottom",
          "right-bottom"
        ].includes(val);
      }
    },
    // 层级
    zIndex: {
      type: Number,
      default: 1
    },
    // 外边距
    margin: {
      type: [Array, Number],
      default: 10
    },
    // 主题
    theme: {
      type: String,
      default: "light",
      validator() {
        return ["light", "dark"];
      }
    }
  },
  computed: {
    styles() {
      return {
        zIndex: this.zIndex,
        margin: []
          .concat(this.margin)
          .map(n => `${n}px`)
          .join(" ")
      };
    },
    classes() {
      return [`is-${this.theme}`, this.placement];
    }
  }
};
</script>

<style lang="less">
@import "../../style/placement.less";
</style>
