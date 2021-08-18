<template>
  <div class="CartBomNav">
    <input type="checkbox" name="selectCart" id="checkboxAll" :checked="isSelectAll" @click="selectAll">
    <label class="checkboxAllLabel" for="checkboxAll">全选</label>
    <span class="Total">总计:{{totalPrice}}</span>
    <span class="gotoTotal rightF">去结算({{totalNum}})</span>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name:"CartBomNav",
    methods:{
      selectAll(){
        // console.log("-------");
        if(this.isSelectAll === "checked"){
          this.cartList.forEach(item=>{
            item.checked = "";
          });
        }else{
          this.cartList.forEach(item=>{
            item.checked = "checked";
          });
        }
      }
    },
    computed:{
      ...mapGetters({
        cartList:"cartData"
      }),
      totalPrice(){
        return "$"+this.cartList.filter(item=>{
          return item.checked === "checked";
        }).reduce((preValue,item)=>{
          return preValue + item.price * item.count;
        },0).toFixed(2);
      },
      totalNum(){
        return this.cartList.filter(item=>{
          return item.checked === "checked";
        }).length;
      },
      isSelectAll(){
        if(this.cartList.length === 0){
          return "";
        }else{
          // if(this.cartList.filter(item=>{
          //   return item.checked === ""
          // }).length > 0){
          //   return "";
          // }else{
          //   return "checked";
          // }
          // 上面的方法全部遍历完了,而这个只要找到就结束
          if(this.cartList.find(item=>{
            return item.checked === ""
          })){
            return "";
          }else{
            return "checked";
          }
        }
      }
    }
  }
</script>

<style scoped>
  .CartBomNav{
    height: 30px;
    line-height: 30px;
    background-color: #aaa;
    padding-left: 10px;
    font-size: 15px;
  }
  .checkboxAllLabel{
    margin-left: 5px;
  }
  .Total{
    margin-left: 10%;
  }
  .gotoTotal{
    display: inline-block;
    height: 100%;
    background-color: orange;
    color: #fff;
    padding: 0 10px;
  }
</style>