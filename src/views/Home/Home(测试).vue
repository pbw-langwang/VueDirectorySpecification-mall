<template>
<!-- 说明:该文件本来是Home.vue,只是测试了几个request的封装,
但是感觉删除了不好,如果想测试,就把这个的名字换成Home.vue,把另一个换成其他的,测试完后再改回来 -->
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="left"></div>
      <div slot="center">
        <p>购物街</p>
      </div>
      <div slot="right"></div>
    </nav-bar>
    <p style="font-size:21px">首页</p>
    <p style="font-size:2rem">首页</p>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar.vue"
  import {request1} from "network/request.js" 
  import {request2} from "network/request.js" 
  import {request} from "network/request.js" 

  export default {
    name:"Home",
    components:{
      NavBar
    },
    created(){
      request1({
        url:"/home/multidata"
      },res=>{
        console.log(res);
      },err=>{
        console.log(err);
      })

      request2({
        baseconfig:{
          url:"/home/multidata"
        },
        success:function(res){
          console.log(res);
        },
        failure:function(err){
          console.log(err);
        }
      })

      request({
        url:"/home/multidata"
      })
      .then(res=>{console.log(res)})
      .catch(err=>{console.log(err)})
    }
  }
</script>

<style scoped>
  .home-nav{
    background-color: var(--color-tint);
    font-size: 1.5rem;
    color: white;
  }
</style>