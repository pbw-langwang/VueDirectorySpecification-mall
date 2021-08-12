<template>
  <div>
    <nav-bar>
      <div slot="left" @click="backClick">
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
    name:"DetailNavBar",
    components:{
      NavBar
    },
    data(){
      return {
        titleList:["详情","参数","评论","推荐"],
        currenctIndex:0,
      }
    },
    methods:{
      getIndex(index){
        this.currenctIndex = index;
        this.$emit("detailNavClick",index);
      },
      backClick(){
        this.$router.back();
      }
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