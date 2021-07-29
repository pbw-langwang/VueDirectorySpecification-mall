<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="left"></div>
      <div slot="center">
        <p>购物街</p>
      </div>
      <div slot="right"></div>
    </nav-bar>

    <hmoe-swiper :banner="banners"></hmoe-swiper>
    
    <recommend-view :recommend="recommends"/>

    <img style="width:100%" src="~assets/img/home/recommend_bg.jpg">

    <tab-control class="home-tabcontrol" :title="['流行','推荐','精选']" 
    activeColor="blue" @tabClick="tabClick"/>

    <product-list :productList="goods[currentType].list"/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar.vue"
  import TabControl from 'components/common/tabControl/TabControl.vue'
  import ProductList from 'components/common/productList/ProductList.vue'

  import HmoeSwiper from './components/HmoeSwiper.vue'
  import RecommendView from './components/RecommendView.vue'

  import {getHomeMultidata , getHomeGoods} from "network/home.js"

  export default {
    name:"Home",
    data(){
      return{
        banners:[],
        recommends:[],
        goods:{
          'pop':{
            page:0,
            list:[]
          },
          'sell':{
            page:0,
            list:[]
          },
          'new':{
            page:0,
            list:[]
          },
        },
        currentType:'pop',
      }
    },
    components:{
      NavBar,
      TabControl,
      ProductList,

      HmoeSwiper,
      RecommendView,
    },
    created(){
      this.getHomeMultidata2();
      this.getHomeGoods2("pop");
      this.getHomeGoods2("new");
      this.getHomeGoods2("sell");
    },
    methods:{
      /**
       * 事件
       */
      tabClick(index){
        console.log(index);
        switch (index){
          case 0: 
            this.currentType = "pop";
            break;
          case 1:
            this.currentType = "new";
            break;
          default:
            this.currentType = "sell";
            break;
        }
      },

      /**
       * 网络请求
       */
      getHomeMultidata2(){
        getHomeMultidata().then(res=>{
          console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        }).catch(err=>{
          console.log(err);
        });
      },
      getHomeGoods2(type){
        const page = this.goods[type].page+1;
        getHomeGoods(type,page).then(res=>{
          console.log(res);
          this.goods[type].list = this.goods[type].list.concat(res.data.list);
          this.goods[type].page += 1;
          console.log(this.goods);
        });
      },
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
  }
  .home-nav{
    background-color: var(--color-tint);
    font-size: 1.5rem;
    color: white;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }
  .home-tabcontrol{
    position: sticky;
    top: 43px;
    left: 0;
    right: 0;
  }
</style>