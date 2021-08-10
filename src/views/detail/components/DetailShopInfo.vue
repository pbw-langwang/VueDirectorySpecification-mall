<template>
  <div class="detail-shopInfo">
    <div class="flex-row-spaceBetween">
      <div class="shopTop-left">
        <img class="shopTop-img" :src="shop.logo">
        <p class="shopTop-name">{{shop.name}}</p>
      </div>
      <div>
        <p class="rightF">进店逛逛 》</p>
      </div>
    </div>
    <div class="flex-row-spaceBetween">
      <div class="left flex-row-spaceAround">
        <div class="flex-column-spaceAround">
          <p class="marginB">{{shop.sells | sellFilter}}</p>
          <p>总销量</p>
        </div>
        <div class="flex-column-spaceAround">
          <p class="marginB">{{shop.goodsCount}}</p>
          <p>全部宝贝</p>
        </div>
      </div>
      <div class="score">
        <div v-for="item in shop.score" :key="item.name" class="flex-row-spaceBetween score-div">
          <span>{{item.name}}</span>
          <span class="scorescore" :class="scoreColor(item.isBetter)">{{item.score}}</span>
          <span v-if="item.isBetter" class="redBg">高</span>
          <span v-else class="greenBg">低</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name:"DetailShopInfo",
  props:{
    shop:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  methods:{
    scoreColor(e){
      return e ? "redColor" : "greenColor";
    }
  },
  filters:{
    sellFilter(value){
      let sellNum;
      if(value > 10000){
        sellNum = (value/10000).toFixed(2);
      }
      return `${sellNum}万`;
    }
  }
}
</script>

<style scoped>
  .detail-shopInfo{
    padding: 0px 10px;
  }
  .shopTop-left{
    display: flex;
    align-items: center;
  }
  .shopTop-img{
    width: 60px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .shopTop-name{
    font-size: 1.2rem;
    font-weight: 700;
  }
  .left{
    width: 45%;
    border-right: solid 1px #666;
  }
  .marginB{
    margin-bottom: 15px;
    font-size: 1.2rem;
    font-weight: 700;
  }
  .score{
    width: 50%;
    line-height: 30px;
  }
  .score-div{
    margin-bottom: 10px;
  }
  .scorescore{
    padding: 0px 15px;
  }
  .redColor{
    color: red;
  }
  .greenColor{
    color: green;
  }
  .redBg{
    background-color: red;
    color: white;
    padding: 2px;
    border-radius: 4px;
  }
  .greenBg{
    background-color: green;
    color: white;
    padding: 2px;
    border-radius: 4px;
  }
</style>