<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="left"></div>
      <div slot="center">
        <p>购物街</p>
      </div>
      <div slot="right"></div>
    </nav-bar>
    <p style="font-size:21px">首页</p>
    <p style="font-size:2rem">首页</p>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar.vue"

  export default {
    name:"Home",
    components:{
      NavBar
    }
  }
</script>

<style scoped>
  .home-nav{
    background-color: var(--color-tint);
    font-size: 1.5rem;
    color: white;
  }
</style>