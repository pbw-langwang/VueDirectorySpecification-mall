<template>
  <div class="flex-row-spaceAround">
    <div class="tab-control" v-for="(item,index) in title" :key="item" @click="change(index)">
      <span :style="actColor(index)">{{item}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name:"TabControl",
    props:{
      title:{
        type:Array,
        default(){
          return []
        }
      },
      activeColor:{
        type:String,
        default:"red"
      }
    },
    data(){
      return {
        currentIndex:0,
      }
    },
    methods:{
      actColor(index){
        return this.currentIndex === index ? {color:this.activeColor,'border-bottom':'solid 3px ' +this.activeColor} : "";
      },
      change(index){
        this.currentIndex = index;
        this.$emit("tabClick",index);
      }
    }
  }
</script>

<style scoped>
  .flex-row-spaceAround{    
    background-color: white;
    padding: 15px 0;
  }
  .tab-control{
    text-align: center;
  }
  .tab-control span{
    padding:5px;
  }
</style>