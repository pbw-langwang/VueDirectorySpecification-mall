<template>
  <div class="slide">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name:"Slide",
  created(){
    console.log("SwiperItem.vue is created:"+new Date().getTime());
  },
  mounted(){
    console.log("SwiperItem.vue is mounted:"+new Date().getTime());
  },
}
</script>

<style scoped>
  .slide{
    width: 100%;
    flex-shrink: 0;
  }

  .slide img{
    width: 100%;
  }
</style>