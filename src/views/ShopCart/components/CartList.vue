<template>
  <div>
    <div v-for="(item,index) in cartlist" :key="index">
      <commodity-card 
        :title="item.title"
        :desc="item.desc"
        :num="item.count"
        :price="item.price"
        :img="item.img"
        :showselect="true"
        :checked="item.checked"
        @checkedChange="checkedChange(item)"
      />
    </div>
  </div>
</template>

<script>
  import CommodityCard from 'components/content/commodityCard/CommodityCard.vue';

  export default {
    name:"CartList",
    props:{
      cartlist:{
        type:Array,
        default(){
          return []
        }
      },
    },
    components:{
      CommodityCard,
    },
    methods:{
      // checkedChange(index){
      //   this.cartlist[index].checked = "checked";
      //   // console.log(this.cartlist);
      // }
      checkedChange(item){
        if(item.checked !== ""){
          item.checked = ""
        }else{
          item.checked = "checked";
        }
      }
    }
  }
</script>

<style scoped>

</style>