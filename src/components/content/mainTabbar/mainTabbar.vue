<template>
  <div>
    <tab-bar>
      <tab-bar-item path="/home" activeColor="blue">
      <!-- DOM中使用别名要加上符号~ -->
        <img slot="img" src="~assets/img/tabbarImg/home.png">
        <img slot="active-img" src="~assets/img/tabbarImg/home-active.png">
        <p slot="text">首页</p>
      </tab-bar-item>
      <tab-bar-item path="/classify">
        <img slot="img" src="~assets/img/tabbarImg/classify.png">
        <img slot="active-img" src="~assets/img/tabbarImg/classify-active.png">
        <p slot="text">分类</p>
      </tab-bar-item>
      <tab-bar-item path="/shopcart">
        <img slot="img" src="~assets/img/tabbarImg/shopping-cart.png">
        <img slot="active-img" src="~assets/img/tabbarImg/shopping-cart-active.png">
        <p slot="text">购物车</p>
      </tab-bar-item>
      <tab-bar-item path="/mine">
        <img slot="img" src="~assets/img/tabbarImg/mine.png">
        <img slot="active-img" src="~assets/img/tabbarImg/mine-active.png">
        <p slot="text">我的</p>
      </tab-bar-item>
    </tab-bar>
  </div>
</template>

<script> 
  import TabBar from 'components/common/tabbar/TabBar.vue';
  import TabBarItem from 'components/common/tabbar/TabBarItem.vue';

  export default {
    name:"mainTabbar",
    components:{
      TabBar,
      TabBarItem
    }
  }
</script>
