<template>
  <div class="PbwScroll">
    <div class="Pbwcontent">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"

  export default {
    name:"Scroll",
    data(){
      return {
        BS:null,
      }
    },
    created(){
      console.log("Scroll.vue is created:"+new Date().getTime());
    },
    mounted(){
      console.log("Scroll.vue is mounted:"+new Date().getTime());
      setTimeout(()=>{
        this.BS = new BScroll(".PbwScroll",{
          /* 不加click:true,就监听不了tabControl的点击,
             如果在tabControl里面加个按钮(原生元素),是可以监听按钮点击的 */
          click:true,
        });
      },1000);
    },
    methods:{
      scrollTo(x,y,time=500){
        this.BS.scrollTo(x,y,time);
      },
    }
  }
</script>

<style scoped>

</style>