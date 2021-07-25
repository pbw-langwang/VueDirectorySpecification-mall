<template>
  <div class="tab-bar">
    <slot></slot>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
  .tab-bar{
    background-color: #f2f2f2;
    position: fixed;
    left: 0;
    right: 0;
    /* 写这两个可以保证其是100%宽度 */
    bottom: 0;
    display: flex;
    box-shadow: 0px -1px 2px rgba(0, 0, 0, .2);
  }
</style>