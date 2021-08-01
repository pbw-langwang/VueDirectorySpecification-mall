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
    props:{
      probeType:{
        type:Number,
        default:1,
      },
      pullUpLoad:{
        type:Boolean,
        default:false,
      }
    },
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
          probeType:this.probeType,
          pullUpLoad: this.pullUpLoad,
        });

        this.BS.on("scroll",(position)=>{
          // console.log(position);
          this.$emit("scroll",position);
        });

        this.BS.on("pullingUp",()=>{
          console.log("上拉刷新咯!");
          //发送网络请求,请求更多页的数据
          this.$emit("pullingUp");
          //等数据请求完成,并将新的数据显示出来后
          // this.BS.finishPullUp();
        });
      },1000);
    },
    methods:{
      scrollTo(x,y,time=500){
        this.BS.scrollTo(x,y,time);
      },
      myfinishPullUp(){
        this.BS.finishPullUp();
      }
    }
  }
</script>

<style scoped>

</style>