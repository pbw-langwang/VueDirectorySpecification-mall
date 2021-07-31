<template>
  <div class="productlistitem">
    <img class="photo" :src="productlistitem.show.img" />
    <div class="content">
      <p class="title ellipsis1">{{productlistitem.title}}</p>
      <span class="price">{{productlistitem.price}}</span>
      <img src="~assets/img/home/collect.svg">
      <span class="collect">{{productlistitem.cfav}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name:"ProductListItem",
  props:{
    productlistitem:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  created(){
    console.log("ProductListItem.vue is created:"+new Date().getTime());
  },
  mounted(){
    console.log("ProductListItem.vue is mounted:"+new Date().getTime());
  },
}
</script>

<style scoped>
  .photo{
    width: 100%;
    border-radius: 5px;
  }
  .content{
    margin: 0 auto;
    width: 90%;
    text-align: center;
  }
  .content img{
    width: 1rem;
    height: 1rem;
    vertical-align: text-top;
  }
  .price{
    margin-right: 20px;
    color: var(--color-high-text);
  }
</style>