<template>
  <div class="CartBomNav">
    <input type="checkbox" name="selectCart" id="checkboxAll" :checked="checked" @click="changeAll">
    <label class="checkboxAllLabel" for="checkboxAll">全选</label>
    <span class="Total">总计:{{totalPrice}}</span>
    <span class="gotoTotal rightF">去结算({{totalNum}})</span>
  </div>
</template>

<script>
  export default {
    name:"CartBomNav",
    data(){
      return{
        checked:""
      }
    },
    methods:{
      changeAll(){
        
      }
    },
    computed:{
      totalPrice(){
        return "$"+this.$store.state.cartList.filter(item=>{
          return item.checked === "checked";
        }).reduce((preValue,item)=>{
          return preValue + item.price * item.count;
        },0).toFixed(2);
      },
      totalNum(){
        return this.$store.state.cartList.filter(item=>{
          return item.checked === "checked";
        }).length;
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