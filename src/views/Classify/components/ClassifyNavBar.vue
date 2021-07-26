<template>
  <div>
    <nav-bar>
      <div slot="left">
        <img class="back" src="~assets/img/common/back.svg">
      </div>
      <div slot="center" class="flex-row-spaceAround">
        <div v-for="(item,index) in titleList" :key="item"  class="flex1" 
          :class="index == currenctIndex ? 'active':''"
          @click="getIndex(index)"
        >
          {{item}}
        </div>
      </div>
      <div slot="right"></div>
    </nav-bar>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar.vue"

  export default {
    components:{
      NavBar
    },
    data(){
      return {
        titleList:["参数","详情","评论","推荐"],
        currenctIndex:0,
      }
    },
    methods:{
      getIndex(index){
        this.currenctIndex = index;
      },
    }
  }
</script>

<style scoped>
  .active{
    color: var(--color-high-text);
  }
  .back{
    width: 40%;
  }
</style>