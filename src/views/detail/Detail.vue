<template>
  <div class="detail">
    <detail-nav-bar ref="navBar" @detailNavClick="detailNavClick"/>
    <scroll class="content1" ref="scroll"
      :probe-type="3"
      @scroll="detailNavshow"
    >
      <detail-swiper :banner="TopImages"/>
      <detail-goods-info class="marginBottom" :goods="Goods"/>
      <detail-shop-info class="marginBottom" :shop="shop"/>
      <detail-goods-img :goods-img="goodsImg"/>
      <detail-good-params ref="params" :goodparams="itemParams"/>
      <p ref="recommend" style="margin:0 0 20px;text-align:center">________推荐________</p>
      <product-list :product-list="Recommends"/>
    </scroll>
    <detail-bom @addCart="addToCart"/>
    <back-top @click.native="backTopClick" v-show="showBTop" />
  </div>
</template>

<script>
  import DetailNavBar from "./components/DetailNavBar.vue"
  import DetailSwiper from "./components/DetailSwiper.vue"
  import DetailGoodsInfo from './components/DetailGoodsInfo.vue'
  import DetailShopInfo from './components/DetailShopInfo.vue'
  import DetailGoodsImg from './components/DetailGoodsImg.vue';
  import DetailGoodParams from './components/DetailGoodParams.vue';
  import DetailBom from './components/DetailBom.vue';

  import Scroll from 'components/common/scroll/Scroll.vue'
  import ProductList from 'components/common/productList/ProductList.vue'

  import {getDetaildata,getRecommend,GoodsInfo,shopInfo} from 'network/detail.js'
  import {debounce} from "commonJS/utils.js"

  import {backTop} from "commonJS/mixins.js"

  export default {
    name:"Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailGoodsInfo,
      DetailShopInfo,
      DetailGoodsImg,
      DetailGoodParams,
      DetailBom,

      Scroll,
      ProductList,
    },
    data(){
      return {
        iid:null,
        TopImages:[],
        Goods:{},
        shop:{},
        goodsImg:{},
        itemParams:{},
        Recommends:[],
        detailimgLoad:null,
        themeTopys:[],
        getThemeoffsetTop:null,
        index:-1,
      }
    },
    mixins:[backTop],
    created(){
      // 我的:加actived,但是不是很好,代码重复
      // 视频:直接把Detail从keep-alive里面剔除
      // if(!this.iid){
      this.iid = this.$route.params.iid;
      getDetaildata(this.iid).then(res=>{
        console.log(res);
        const data = res.result;
        // 1.获取轮播
        this.TopImages = data.itemInfo.topImages;

        // 2.整合商品数据
        this.Goods = new GoodsInfo(data.itemInfo,data.columns,data.shopInfo.services);

        // 3.整合商家数据
        this.shop = new shopInfo(data.shopInfo);

        // 4.获取商品图片
        this.goodsImg = data.detailInfo;

        //5. 获取商品参数
        this.itemParams = data.itemParams;
      }).catch(err=>{
        console.log(err);
      });
      // }
      
      // 获取推荐数据
      getRecommend().then(res=>{
        console.log(res);
        this.Recommends = res.data.list;
      }).catch(err=>{
        console.log(err);
      });

      // 获取要联动的offsetTop
      this.getThemeoffsetTop = debounce(()=>{
        this.themeTopys[0] = 0;
        this.themeTopys[1] = this.$refs.params.$el.offsetTop;
        this.themeTopys[2] = this.$refs.recommend.offsetTop;
        this.themeTopys[3] = this.$refs.recommend.offsetTop;
        this.themeTopys[4] = Infinity;
        // console.log(this.themeTopys);
      },100);
    },
    mounted(){
      // 监听商品图片
      // 时间不能太长,300毫秒会因为不停重置时间,而导致一开时滑动卡顿
      const refresh1 = debounce(this.$refs.scroll.myrefresh,200);
      this.$bus.$on("goodsImgLoad",()=>{
        refresh1();
        this.getThemeoffsetTop();
      });

      const refresh = debounce(this.$refs.scroll.myrefresh,100);
      this.detailimgLoad = ()=>{
        refresh();
        this.getThemeoffsetTop();
      };
      this.$bus.$on("detailitemImgLoad",this.detailimgLoad);
    },
    methods:{
      detailNavClick(index){
        // console.log(index);
        this.$refs.scroll.scrollTo(0,-this.themeTopys[index],500);
      },
      detailNavshow(position){
        // 1.普通做法
        // const length = this.themeTopys.length;
        // for(let i = 0;i<length;i++){
        //   if((this.index !== i) && ((i < length-1 && -position.y >= this.themeTopys[i] && -position.y
        //   < this.themeTopys[i+1]) || (i === length-1 && -position.y >= this.themeTopys[i]))){
        //     this.index = i;
        //     console.log(this.index);
        //     this.$refs.navBar.currenctIndex = this.index;
        //   }
        // }

        // 3.监听backTop是否显示
        this.showBTop = -position.y > 1000;

        //2.hack做法-->在数组的后面加一个极大值 --> 使得if里面变简单
        const length = this.themeTopys.length;
        for(let i = 0;i<length-1;i++){
          if((this.index !== i) && (-position.y >= this.themeTopys[i] && -position.y
          < this.themeTopys[i+1])){
            this.index = i;
            this.$refs.navBar.currenctIndex = this.index;
          }
        }
      },
      addToCart(){
        // console.log("---------");
        const product = {};
        product.img = this.TopImages[0];
        product.title = this.Goods.title;
        product.desc = this.Goods.desc;
        product.price = this.Goods.realPrice;
        product.iid = this.iid;
        // console.log(product);
        
        // 使用vuex,将商品添加进购物车
        // this.$store.commit('addCart', product);
        this.$store.dispatch('addCart', product);
      }
    }
    /**
    没有缓存的的界面,没有deactivated这个东西
    deactivated(){
    destroyed(){
      console.log("detail is destroyed!");
      this.$bus.$off("detailitemImgLoad",this.detailimgLoad);
    },
    activated(){
      this.iid = this.$route.params.iid;
      getDetaildata(this.iid).then(res=>{
        console.log(res);
        this.TopImages = res.result.itemInfo.topImages;
      }).catch(err=>{
        console.log(err);
      })
    },
    destroyed(){
      console.log("详情页销毁");
    },
    */
  }
</script>

<style scoped>
  .content1{
    /* 上下区域高度确定,中间的高度可以用定位或者css的calc函数 */
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 9;
    background-color: #fff;
    /* padding-bottom: 20px; 对batter-scroll无效*/
  }
  .marginBottom{
    margin-bottom: 10px;
  }
</style>