<template>
  <div class="productlistitem" @click="gotodetail">
    <img class="photo" :src="showImg" @load="imgLoad"/>
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
  methods:{
    imgLoad(){
      // console.log(this.$route.path.indexOf("/home"));
      // console.log(this.$route.path.indexOf("/detail"));
      if(this.$route.path.indexOf("/home") >= 0){
        this.$bus.$emit("homeitemImgLoad");
      }else if(this.$route.path.indexOf("/detail") >= 0){
        this.$bus.$emit("detailitemImgLoad");
      }
    },
    gotodetail(){
      console.log("去详情页!");
      this.$router.push("/detail/"+this.productlistitem.iid);
    }
  },
  computed:{
    showImg(){
      return this.productlistitem.image || this.productlistitem.show.img;
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
  .content img{
    width: 15px;
    height: 15px;
    vertical-align: text-bottom;
  }
  .title{
    font-size: 15px;
  }
  .price{
    font-size: 15px;
    margin-right: 20px;
    color: var(--color-high-text);
  }
  .collect{
    font-size: 15px;
  }
</style>