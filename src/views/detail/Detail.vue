<template>
  <div class="detail">
    <detail-nav-bar/>
    <scroll class="content1" ref="scroll"
      :probe-type="3"
      :pull-up-load="true"
    >
      <detail-swiper :banner="TopImages" @detailImgload="imgLoad"/>
      <detail-goods-info :goods="Goods" style="margin-bottom:10px"/>
      <detail-shop-info :shop="shop"/>
    </scroll>
  </div>
</template>

<script>
  import DetailNavBar from "./components/DetailNavBar.vue"
  import DetailSwiper from "./components/DetailSwiper.vue"
  import DetailGoodsInfo from './components/DetailGoodsInfo.vue'
  import DetailShopInfo from './components/DetailShopInfo.vue'

  import Scroll from 'components/common/scroll/Scroll.vue'

  import {getDetaildata,GoodsInfo,shopInfo} from 'network/detail.js'

  export default {
    name:"Detail",
    components:{
      DetailNavBar,
      DetailSwiper,
      DetailGoodsInfo,
      DetailShopInfo,

      Scroll,
    },
    data(){
      return {
        iid:null,
        TopImages:[],
        Goods:{},
        shop:{},
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
      }).catch(err=>{
        console.log(err);
      });
      // }
    },
    activated(){
      // this.iid = this.$route.params.iid;
      // getDetaildata(this.iid).then(res=>{
      //   console.log(res);
      //   this.TopImages = res.result.itemInfo.topImages;
      // }).catch(err=>{
      //   console.log(err);
      // })
    },
    destroyed(){
      console.log("详情页销毁");
    },
    methods:{
      imgLoad(){
        this.$refs.scroll.myrefresh();
      }
    }
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
</style>