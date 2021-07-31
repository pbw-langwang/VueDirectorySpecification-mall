<template>
  <div class="tabbar-item" @click="tabbaritemClick">
    <!-- slot最好用div框起来，不然可能某些事件因为替换而消失 -->
    <div v-if="!actimg" class="tabbar-item-img">
      <slot name="img"></slot>
    </div>
    <div v-else class="tabbar-item-img">
      <slot name="active-img"></slot>
    </div>
    <div class="tabbar-item-text" :style="actColor">
      <slot name="text"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name:"TabBarItem",
    props:{
      path:String,
      activeColor:{
        type:String,
        default:"red"
      }
    },
    methods:{
      tabbaritemClick(){
        if(this.$route.path !== this.path){
          this.$router.replace(this.path);
        }
      }
    },
    computed:{
      // 实现文字点击变红
      actColor(){
        return this.$route.path == this.path ? {color:this.activeColor} : {}
      },

      // 实现图像的点击切换
      actimg(){
        // 视频的方法：
        // return this.$route.path.indexOf(this.path) !== -1;

        // 我的方法：
        return this.$route.path == this.path ? true : false;
      }
    },
    created(){
      console.log("TabBarItem.vue is created:"+new Date().getTime());
    },
    mounted(){
      console.log("TabBarItem.vue is mounted:"+new Date().getTime());
    },
  }
</script>

<style scoped>
  .tabbar-item{
    height: 49px;
    flex: 1;
    text-align: center;
  }

  .tabbar-item-img img{
    width: 24px;
    height: 24px;
    margin-top: 2px;
  }

  .tabbar-item-text p{
    margin: 0;
    font-size: var(--font-size);
  }
</style>