<template>
  <div>
    <swiper class="detailswiper">
      <swiper-item v-for="(item,index) in banner" :key="index">
        <img class="topImg" :src="item" @load="detailImgload">
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import {Swiper,SwiperItem} from 'components/common/swiper/index.js'

  export default {
    name:"DetailSwiper",
    components:{
      Swiper,
      SwiperItem
    },
    props:{
      banner:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data(){
      return {
        isLoad:false,
      }
    },
    methods:{
      detailImgload(){
        if(!this.isLoad){
          this.$emit("detailImgload");
          this.isLoad = !this.isLoad;
        }
      }
    }
  }
</script>
<style scoped>
  .detailswiper{
    height: 300px;
    overflow: hidden;
  }
  .topImg{
    margin-top: -25%;
  }
</style>