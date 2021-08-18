<template>
  <div>
    <nav-bar class="cart-nav">
      <div slot="left"></div>
      <div slot="center">购物车({{length}})</div>
      <div slot="right"></div>
    </nav-bar>

    <scroll class="content1" ref="scroll">
      <!-- <p>{{this.$store.state.cartList}}</p>
      <div v-for="(item,index) in this.$store.state.cartList" :key="index">
        <van-card
          :num="item.count"
          :price="item.price"
          :desc="item.desc"
          :title="item.title"
          :thumb="item.img"
        />
      </div> -->
      <!-- 测试计算属性结合store -->
      <!-- <p>{{cartLength}}</p>
      <p>{{this.$store.state.cartList.length}}</p> -->

      <cart-list :cartlist="cartdata"/>
    </scroll>

    <cart-bom-nav class="CartBomNav"/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar.vue';
  import Scroll from 'components/common/scroll/Scroll.vue';

  import CartList from './components/CartList.vue';
  import CartBomNav from './components/CartBomNav.vue';

  import {mapGetters} from "vuex";

  export default {
    name:"ShopCart",
    data(){
      return {

      }
    },
    components:{
      NavBar,
      Scroll,

      CartList,
      CartBomNav,
    },
    computed:{
      // 两种写法
      ...mapGetters({
        length:"cartLength",
        cartdata:"cartData",
      }),
      // ...mapGetters(["cartLength"])
    },
    activated(){
      this.$refs.scroll.myrefresh();
    }
  }
</script>

<style scoped>
  .cart-nav{
    background-color: var(--color-tint);
    font-size: 18px;
    color: white;
  }
  .content1{
    position: absolute;
    top: 44px;
    bottom: 79px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
  .CartBomNav{
    position: absolute;
    bottom: 49px;
    left: 0;
    right: 0;
  }
</style>