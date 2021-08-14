<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="left"></div>
      <div slot="center">
        <p>购物街</p>
      </div>
      <div slot="right"></div>
    </nav-bar>

    <tab-control 
        :title="['流行','推荐','精选']" 
        activeColor="blue" 
        @tabClick="tabClick"
        ref="HomeTabcontrol1"
        v-show="isFixed"
        class="FixedTabcontrol"
      />

    <scroll class="content1" ref="scroll" 
      :probe-type="3"
      :pull-up-load="true"
      @scroll="contentScroll"
      @pullingUp="contentLoad"
    >
      <hmoe-swiper :banner="banners" @swiperimgLoad="swiperimgLoad"></hmoe-swiper>
    
      <recommend-view :recommend="recommends"/>

      <img style="width:100%" src="~assets/img/home/recommend_bg.jpg">

      <tab-control 
        :title="['流行','推荐','精选']" 
        activeColor="blue" 
        @tabClick="tabClick"
        ref="HomeTabcontrol2"
      />

      <product-list :productList="goods[currentType].list"/>
    </scroll>

    <back-top @click.native="backTopClick" v-show="showBTop" />
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
  import {debounce} from "commonJS/utils.js"

  import {backTop} from "commonJS/mixins.js"

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
        tabOffsetTop:0,
        isFixed:false,
        saveY:0,
        homeimgLoad:null,
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
    mixins:[backTop],
    created(){
      console.log("Home.vue is created:"+new Date().getTime());
      this.getHomeMultidata2();
      this.getHomeGoods2("pop");
      this.getHomeGoods2("new");
      this.getHomeGoods2("sell");
    },
    mounted(){
      console.log("Home.vue is mounted:"+new Date().getTime());
      // 监听图片加载完成 ---> 可以解决昨天tabControl的bug
      // this.$bus.$on("itemImgLoad",()=>{
      //   console.log("Home.vue 监听图片加载了"+new Date().getTime());
      //   this.$refs.scroll.myrefresh();
      // });

      // 防抖后代码
      const refresh = debounce(this.$refs.scroll.myrefresh,100);
      this.homeimgLoad = ()=> {
        refresh();
      };
      this.$bus.$on("homeitemImgLoad",this.homeimgLoad);
    },

    // 现在的scroll-batter没有这个bug,这里可以省略
    activated(){
      // console.log("activated");
      this.$refs.scroll.scrollTo(0,this.saveY,0);
      this.$refs.scroll.myrefresh();
    },
    deactivated(){
      // console.log("deactivated");
      // 1.保存y值
      this.saveY = this.$refs.scroll.getscrollY();

      // 2.不能取消监听 -> 不然就会出现回到首页不能滚动
      // this.$bus.$off("homeitemImgLoad",this.homeimgLoad);
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
        this.$refs.HomeTabcontrol1.currentIndex = index;
        this.$refs.HomeTabcontrol2.currentIndex = index;
      },
      contentScroll(position){
        // console.log(position);
        // if(position.y < -1000){
        //   this.showBTop = true;
        // }else{
        //   this.showBTop = false;
        // }

        //简写,判断回到顶部图标是否显示
        this.showBTop = -position.y > 1000;

        //判断选项卡是否吸顶
        this.isFixed = -position.y > this.tabOffsetTop;
      },
      contentLoad(){
        this.getHomeGoods2(this.currentType);
        // 这个我的思路是直接就在Scroll里面弹出事件后就自己执行
        this.$refs.scroll.myfinishPullUp();

        // 解决了一个的滚动,但是切换tabControl就不行了
        // this.$refs.scroll.BS.refresh();
      },
      swiperimgLoad(){
        // console.log(this.$refs.HomeTabcontrol.$el.offsetTop);
        this.tabOffsetTop = this.$refs.HomeTabcontrol2.$el.offsetTop;
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

    /* 用了batter-scroll,所以无用了
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9; */
  }
  .FixedTabcontrol{
    position: relative;
    top: -1px;
    z-index: 9;
    background-color: white;
  }
  /* 用了batter-scroll,所以无用了
  .home-tabcontrol{
    position: sticky;
    top: 43px;
    left: 0;
    right: 0;
  } */
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