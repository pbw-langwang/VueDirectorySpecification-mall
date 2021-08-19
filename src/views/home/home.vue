<template>
  <div class="home">
    <h2>这是home</h2>
    <home-tabbar />
    <tabbar />
    <main-tabbar />
  </div>
</template>

<script>
  import Tabbar from 'components/common/tabbar/Tabbar.vue';

  import MainTabbar from 'components/content/mainTabbar/MainTabbar.vue';

  import HomeTabbar from "./components/Hometabbar.vue";

  export default {
    name:"Home",
    components:{
      // 和上面的顺序保持一致
      Tabbar,

      MainTabbar,

      HomeTabbar,
    },
  }
</script>

<style scoped>

</style>