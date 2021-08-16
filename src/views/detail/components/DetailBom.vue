<template>
  <div class="bottom">
    <div class="left">
      <div class="item flex-column-spaceAround">
        <img class="icon" src="~assets/img/detail/merchants.svg" />
        <p class="title">店铺</p>
      </div>
      <div class="item flex-column-spaceAround">
        <img class="icon" src="~assets/img/detail/service.svg" />
        <p class="title">客服</p>
      </div>
      <div class="item flex-column-spaceAround">
        <img class="icon" src="~assets/img/common/collect.svg" />
        <p class="title">收藏</p>
      </div>
    </div>
    <div class="right">
      <div class="Rleft" @click="addCart">
        <p class="add_shop">加入购物车</p>
      </div>
      <div class="Rright">
        <p class="add_shop">立即购买</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:"DetailBom",
    methods:{
      addCart(){
        this.$emit("addCart");
      }
    }
  }
</script>

<style scoped>
  .bottom{
    height: 49px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9;
    border-top: solid 1px rgba(0,0,0,0.6);
    display: flex;
  }
  .left{
    width: 40%;
    display: flex;
  }
  .item{
    flex: 1;
  }
  .icon{
    width: 20px;
    height: 20px;
  }
  .title{
    font-size: 0.6rem;
  }
  .right{
    width: 60%;
    display: flex;
    padding: 4px 0;
  }
  .Rleft{
    flex: 1;
    text-align: center;
    height: 41px;
    line-height: 41px;
    background-color: rgb(255, 218, 8);
    border-radius: 25px 0 0 25px;
  }
  .Rright{
    flex: 1;
    text-align: center;
    height: 41px;
    line-height: 41px;
    background-color: orange;
    border-radius: 0 25px 25px 0;
  }
  .add_shop{
    color: #fff;
  }
</style>