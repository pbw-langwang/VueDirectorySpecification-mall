<template>
  <div class="toast" v-if="show">
    <p class="message">{{message}}</p>
  </div>
</template>

<script>
  export default {
    name:"Toast",
    data(){
      return {
        message:"",
        show:false,
      }
    },
    methods:{
      Show(message="默认文字",time=1500){
        this.show = true;
        this.message = message;
        setTimeout(()=>{
          this.show = false;
          this.message = "";
        },time)
      }
    }
  }
</script>

<style scoped>
  .toast{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 8px 10px;
    background-color: rgba(0, 0, 0,.5);
    color: #fff;
    z-index: 999;
    border-radius: 10px;
  }
</style>