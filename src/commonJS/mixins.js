// 混入(mixins)代码
import BackTop from 'components/common/backTop/BackTop.vue';
export const backTop = {
  components:{
    BackTop
  },
  data(){
    return{
      showBTop:false,
    }
  },
  methods: {
    backTopClick(){
      this.$refs.scroll.scrollTo(0,0,800);
    },
  },
}