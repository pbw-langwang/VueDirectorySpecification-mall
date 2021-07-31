<template>
  <div id="app">
    <router-view/>
    <main-tabbar/>
  </div>
</template>

<script>
  import mainTabbar from "components/content/mainTabbar/MainTabbar";

  export default {
    name:'app',
    components:{
      mainTabbar,
    },
    created(){
      console.log("App.vue is created:"+new Date().getTime());
    },
    mounted(){
      console.log("App.vue is mounted:"+new Date().getTime());
    },
  }
</script>

<style>
  @import "assets/css/mybase.css";
</style>
