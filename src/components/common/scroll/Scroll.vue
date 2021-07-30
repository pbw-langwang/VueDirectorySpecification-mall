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
    mounted(){
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