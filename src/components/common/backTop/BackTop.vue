<template>
  <div class="back-top">
    <img src="~assets/img/common/top.svg">
  </div>
</template>

<script>
  export default {
    name:"BackTop",

  }
</script>

<style scoped>
  .back-top{
    position: fixed;
    right: 20px;
    bottom: 100px;
    background-color: white;
    padding: 10px;
    border-radius: 50%;
    z-index: 100;
  }
</style>