<template>
  <div class="productList flex-row-spaceAround">
    <product-list-item class="productList-item" v-for="item in productList" :key="item.iid" :productlistitem="item"/>
  </div>
</template>

<script>
  import ProductListItem from 'components/content/productListItem/ProductListItem.vue'

  export default {
    name:"ProductList",
    props:{
      productList:{
        type:Array,
        default(){
          return []
        }
      }
    },
    components:{
      ProductListItem
    },
    created(){
      console.log("ProductList.vue is created:"+new Date().getTime());
    },
    mounted(){
      console.log("ProductList.vue is mounted:"+new Date().getTime());
    },
  }
</script>

<style scoped>
  .productList-item{
    width: 45%;
  }
</style>