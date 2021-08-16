<template>
  <div class="commodityCard">
    <div class="select" v-if="showselect">
      <input type="checkbox" name="selectCart" id="checkbox" :checked="checked" @click="change">
    </div>

    <div class="photo">
      <img class="photoImg" :src="img">
    </div>

    <div :class="showselect ? 'content2' : 'content'">
      <p class="title ellipsis1">{{title}}</p>
      <p class="desc ellipsis1">{{desc}}</p>
      <div class="bottom">
        <span class="price">{{price | getPrice()}}</span>
        <span class="num rightF">X{{num}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name:"CommodityCard",
    props:{
      title:{
        type:String,
        default:"标题"
      },
      desc:{
        type:String,
        default:"描述"
      },
      num:{
        type:Number,
        default:2
      },
      price:{
        type:String,
        default:"2.0"
      },
      img:{
        type:String,
        default:""
      },
      showselect:{
        type:Boolean,
        default:false
      },
      checked:{
        type:String,
        default:""
      }
    },
    filters:{
      getPrice(price){
        return "$"+price;
      }
    },
    methods:{
      change(){
        this.$emit("checkedChange");
      }
    }
  }
</script>

<style scoped>
  .commodityCard{
    display: flex;
    padding: 2%;
    min-height: 100px;
    max-height: 180px;
  }
  .select{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .photo{
    width: 36%;
    margin-right: 2%;
    text-align: center;
    overflow: hidden;
  }
  .photoImg{
    width: 90%;
  }
  .content{
    width: 60%;
    position: relative;
  }
  .content2{
    width: 55%;
    position: relative;
  }
  .title{
    color: black;
    font-weight: 700;
  }
  .desc{
    margin-top: 2%;
    color: #333;
  }
  .bottom{
    position: absolute;
    bottom: 2%;
    left: 0;
    right: 0;
  }
  .price{
    font-size: 1.5rem;
    color: red;
  }
  .ellipsis1{
    -webkit-line-clamp: 2;
  }
</style>