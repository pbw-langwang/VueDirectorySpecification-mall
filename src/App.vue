<template>
  <div id="app">
    <router-view/>
    <main-tabbar/>
  </div>
</template>

<script>
  import mainTabbar from "components/content/mainTabbar/MainTabbar";
  import {getHomeMultidata , getHomeGoods} from "network/home.js"

  export default {
    name:'app',
    components:{
      mainTabbar,
    },
    created(){
      console.log("App.vue is created:"+new Date().getTime());
      this.getHomeMultidata2();
      this.getHomeGoods2("pop");
    },
    mounted(){
      console.log("App.vue is mounted:"+new Date().getTime());
      this.getHomeMultidata2();
      this.getHomeGoods2("pop");
    },
    methods:{
      getHomeMultidata2(){
        getHomeMultidata().then(res=>{
          console.log("App.vue请求的");
        })
      },
      getHomeGoods2(type){
        getHomeGoods(type,1).then(res=>{
          console.log("App.vue请求的");
        });
      },
    }
  }
</script>

<style>
  @import "assets/css/mybase.css";
</style>
