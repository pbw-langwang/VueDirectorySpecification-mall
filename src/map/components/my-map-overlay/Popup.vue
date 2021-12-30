<template>
  <MyMapOverlay ref="overlay" :options="param">
    <MyBasePopupBox ref="popupBox" @close="hide">
      <slot></slot>
    </MyBasePopupBox>
  </MyMapOverlay>
</template>

<script>
import MyMapOverlay from "./Overlay";
import MyBasePopupBox from "../base/Popupbox";
export default {
  name: "MyMapPopup",
  components: { MyMapOverlay, MyBasePopupBox },
  props: {
    options: {
      type: Object,
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      // param: { ...this.options }
    };
  },
  computed: {
    param() {
      return { ...this.options };
    }
  },
  methods: {
    show(coordinate) {
      this.$refs.popupBox.show();
      this.$nextTick(() => {
        this.$refs.overlay.setPosition(coordinate);
      });
    },
    hide() {
      this.$refs.overlay.setPosition(null);
      this.$refs.popupBox.hide();
    }
  }
};
</script>
