<template>
  <div class="detail">
    <detail-nav-bar/>
    <scroll class="content1" ref="scroll">
      <detail-swiper :banner="TopImages"/>
      <detail-goods-info class="marginBottom" :goods="Goods"/>
      <detail-shop-info class="marginBottom" :shop="shop"/>
      <detail-goods-img :goods-img="goodsImg"/>
      <detail-good-params :goodparams="itemParams"/>
      <p style="margin:0 0 20px;text-align:center">________推荐________</p>
      <product-list :product-list="Recommends"/>
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from "./components/DetailNavBar.vue"
  import DetailSwiper from "./components/DetailSwiper.vue"
  import DetailGoodsInfo from './components/DetailGoodsInfo.vue'
  import DetailShopInfo from './components/DetailShopInfo.vue'
  import DetailGoodsImg from './components/DetailGoodsImg.vue';
  import DetailGoodParams from './components/DetailGoodParams.vue';

  import Scroll from 'components/common/scroll/Scroll.vue'
  import ProductList from 'components/common/productList/ProductList.vue'

  import {getDetaildata,getRecommend,GoodsInfo,shopInfo} from 'network/detail.js'
  import {debounce} from "commonJS/utils.js"

  export default {
    name:"Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailGoodsInfo,
      DetailShopInfo,
      DetailGoodsImg,
      DetailGoodParams,

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
      }
    },
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

      getRecommend().then(res=>{
        console.log(res);
        this.Recommends = res.data.list;
      }).catch(err=>{
        console.log(err);
      });
    },
    mounted(){
      // 监听商品图片
      // 时间不能太长,300毫秒会因为不停重置时间,而导致一开时滑动卡顿
      const refresh1 = debounce(this.$refs.scroll.myrefresh,200);
      this.$bus.$on("goodsImgLoad",()=>{
        refresh1();
      });

      const refresh = debounce(this.$refs.scroll.myrefresh,100);
      this.detailimgLoad = ()=>{
        refresh();
      };
      this.$bus.$on("detailitemImgLoad",this.detailimgLoad);
    },
    // 没有缓存的的界面,没有deactivated这个东西
    // deactivated(){
    destroyed(){
      // console.log("detail is destroyed!");
      // this.$bus.$off("detailitemImgLoad",this.detailimgLoad);
    }
    /** 
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
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    z-index: 9;
    background-color: #fff;
  }
  .marginBottom{
    margin-bottom: 10px;
  }
</style>