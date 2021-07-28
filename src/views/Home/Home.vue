<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="left"></div>
      <div slot="center">
        <p>购物街</p>
      </div>
      <div slot="right"></div>
    </nav-bar>

    <swiper>
      <swiper-item v-for="(item,index) in banners" :key="index">
        <a :href="item.link">
          <img :src="item.image">
        </a>
      </swiper-item>
    </swiper>

    <p style="font-size:21px">首页</p>
    <p style="font-size:2rem">首页</p>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar.vue"
  import {getHomeMultidata} from "network/home.js"
  import {Swiper,SwiperItem} from 'components/common/swiper/index.js'

  export default {
    name:"Home",
    data(){
      return{
        banners:[],
        recommends:[],
      }
    },
    components:{
      NavBar,
      Swiper,
      SwiperItem
    },
    created(){
      getHomeMultidata().then(res=>{
        console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      }).catch(err=>{
        console.log(err);
      });
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