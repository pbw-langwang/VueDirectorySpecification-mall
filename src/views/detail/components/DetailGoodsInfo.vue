<template>
  <div v-if="Object.keys(goods).length !== 0" class="detail-goodsInfo">
    <h3 class="title">{{goods.title}}</h3>
    <div class="Price">
      <span class="newPrice">{{goods.newPrice}}</span>
      <span class="oldPrice">{{goods.oldPrice}}</span>
      <span v-if="goods.discount" class="discount" :style="{'background-color':goods.discountBgcolor}">{{goods.discount}}</span>
    </div>
    <div class="columns flex-row-spaceBetween">
      <div v-for="item in goods.columns" :key="item">
        <span>{{item}}</span>
      </div>
    </div>
    <div class="services flex-row-spaceBetween">
      <div class="services-div" v-for="item in goods.services" :key="item.name">
        <img v-if="item.icon" class="services-img" :src="item.icon">
        <img class="services-img" v-else src="http://s11.mogucdn.com/p1/160607/upload_ie4tkmbtgqztomjqhezdambqgqyde_44x44.png">
        <span>{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:"DetailGoodsInfo",
    props:{
      goods:{
        type:Object,
        default(){
          return {}
        }
      }
    },
  }
</script>

<style scoped>
  .detail-goodsInfo{
    padding: 0px 10px;
  }
  .title{
    margin-bottom: 15px;
  }
  .Price{
    margin-bottom: 15px;
  }
  .newPrice{
    font-size: 1.5rem;
    color: var(--color-high-text);
    margin-right: 10px;
  }
  .oldPrice{
    font-size: 0.8rem;
    color: var(--color-text);
    margin-right: 10px;
    text-decoration: line-through;
  }
  .discount{
    font-size: 1.1rem;
    color: white;
    padding: 2px 5px;
    border-radius: 10px;
    margin-right: 10px;
    vertical-align: super;
  }
  .columns{
    margin-bottom: 15px;
  }
  .services-div{
    width: 50%;
    line-height: 30px;
  }
  .services-img{
    width: 20px;
    vertical-align: text-bottom;
    margin-right: 5px;
  }
</style>