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
          click:true,
        });
      },1000);
    },
  }
</script>

<style scoped>

</style>