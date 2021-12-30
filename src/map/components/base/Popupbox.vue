<template>
  <div v-if="isOpen" v-clickoutside="handleClickOutside">
    <slot></slot>
  </div>
</template>

<script>
import clickoutside from "../utils/clickoutside";
export default {
  name: "MyBasePopupBox",
  directives: { clickoutside },
  data() {
    return {
      isOpen: false,
      closeOnClick: false
    };
  },
  methods: {
    show() {
      this.handleClickOutside();
      this.isOpen = true;
    },
    hide() {
      this.isOpen = false;
    },
    trigger() {
      if (!this.isOpen) {
        this.show();
      } else {
        this.hide();
      }
    },
    handleClickOutside() {
      if (this.isOpen) {
        if (this.closeOnClick) {
          this.trigger();
          this.$emit("close");
        }
        this.closeOnClick = !this.closeOnClick;
      } else {
        this.closeOnClick = false;
      }
    }
  }
};
</script>
