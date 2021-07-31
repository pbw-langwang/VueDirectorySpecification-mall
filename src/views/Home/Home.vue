<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="left"></div>
      <div slot="center">
        <p>购物街</p>
      </div>
      <div slot="right"></div>
    </nav-bar>

    <scroll class="content1">
      <hmoe-swiper :banner="banners"></hmoe-swiper>
    
      <recommend-view :recommend="recommends"/>

      <img style="width:100%" src="~assets/img/home/recommend_bg.jpg">

      <tab-control class="home-tabcontrol" :title="['流行','推荐','精选']" 
      activeColor="blue" @tabClick="tabClick"/>

      <product-list :productList="goods[currentType].list"/>
    </scroll>

  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar.vue"
  import TabControl from 'components/common/tabControl/TabControl.vue'
  import ProductList from 'components/common/productList/ProductList.vue'
  import Scroll from 'components/common/scroll/Scroll.vue'

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
      Scroll,

      HmoeSwiper,
      RecommendView,
    },
    created(){
      console.log("Home.vue is created:"+new Date().getTime());
      this.getHomeMultidata2();
      this.getHomeGoods2("pop");
      this.getHomeGoods2("new");
      this.getHomeGoods2("sell");
    },
    mounted(){
      console.log("Home.vue is mounted:"+new Date().getTime());
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
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        }).catch(err=>{
          console.log(err);
        });
      },
      getHomeGoods2(type){
        const page = this.goods[type].page+1;
        getHomeGoods(type,page).then(res=>{
          // console.log(res);
          this.goods[type].list = this.goods[type].list.concat(res.data.list);
          this.goods[type].page += 1;
          // console.log(this.goods);
        });
      },
    }
  }
</script>

<style scoped>
  /* scoped中的样式确实是有作用域,但是类似于.content img{},这样的样式,
  会对其它界面产生影响,所以最好都用class表示 */
  #home{
    height: 100vh;
    position: relative;
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
  .content1{
    /* 上下区域高度确定,中间的高度可以用定位或者css的calc函数 */
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
</style>