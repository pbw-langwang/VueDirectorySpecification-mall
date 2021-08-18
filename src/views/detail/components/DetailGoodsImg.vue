<template>
  <div v-if="Object.keys(goodsImg).length !== 0" class="goodsImgBox">
    <div>
      <div class="icon"></div>
      <div class="line"></div>
    </div>
    <p class="goodsImgDesc">{{goodsImg.desc}}</p>
    <div style="margin-top:10px">
      <div class="icon rightF"></div>
      <div class="line rightF" style="margin-top:4px"></div>
    </div>
    <div v-for="(item,index) in goodsImg.detailImage" :key="index">
      <!-- 判断语句 -> 解决后面两个item没有list显示不好看的bug -->
      <div v-if="item.list">
        <p class="goodsImgkey">{{item.key}}</p>
        <div v-for="item1 in item.list" :key="item1">
          <img class="goodsImg" :src="item1" @load="imgLoad">
        </div>
      </div>
      <div v-else>
        <p class="goodsImgkey">{{item.key}}</p>
        <p>{{item.desc}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:"DetailGoodsImg",
    props:{
      goodsImg:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    methods:{
      imgLoad(){
        this.$bus.$emit("goodsImgLoad");
      }
    }
  }
</script>

<style scoped>
  .goodsImgBox{
    padding: 0 10px;
    font-size: 15px;
  }
  .goodsImgkey{
    margin: 10px 0;
    font-weight: 700;
  }
  .goodsImg{
    width: 100%;
    margin-bottom: 10px;
  }
  .icon{
    width: 5px;
    height: 5px;
    background-color: black;
  }
  .line{
    width: 30%;
    border-bottom: solid 1px black;
    margin-bottom: 10px;
  }
</style>