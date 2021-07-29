<template>
  <div class="productlistitem">
    <img class="photo" :src="productlistitem.show.img" />
    <div class="content">
      <p class="title ellipsis1">{{productlistitem.title}}</p>
      <span class="price">{{productlistitem.price}}</span>
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
  }
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
  .price{
    margin-right: 20px;
    color: var(--color-high-text);
  }
</style>