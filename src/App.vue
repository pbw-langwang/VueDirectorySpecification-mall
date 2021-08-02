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

      // 测试setTimeout的"事件循环" ---> 不给参数,也会把其留在后面执行
      console.log("setTimeout的事件循环1");
      setTimeout(()=>{
        console.log("setTimeout的事件循环2");
      });
      setTimeout(()=>{
        console.log("setTimeout的事件循环3");
      },0);
      console.log("setTimeout的事件循环4");
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
