<template>
  <div id="app">
    <home />
  </div>
</template>

<script>
  import home from 'views/home/home.vue';

  export default {
    name:"app",
    components:{
      home,
    }
  }
</script>

<style>
  @import "assets/css/mybase.css";
</style>