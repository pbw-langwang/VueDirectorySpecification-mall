<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left">左</slot>
    </div>
    <div class="center">
      <slot name="center">中</slot>
    </div>
    <div class="right">
      <slot name="right">右</slot>
    </div>
  </div>
</template>

<script>
export default {
  name:"NavBar",
  created(){
    console.log("NavBar.vue is created:"+new Date().getTime());
  },
  mounted(){
    console.log("NavBar.vue is mounted:"+new Date().getTime());
  },
}
</script>

<style scoped>
  .nav-bar{
    display: flex;
    /* 没有内容,所以只设置line-height无效 */
    height: 44px;
    line-height: 44px;
    text-align: center;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, .2);
  }
  
  .left,.right{
    width: 15vw;
    /* background-color: aqua; */
  }

  .center{
    flex: 1;
    /* background-color: blue; */
  }
</style>