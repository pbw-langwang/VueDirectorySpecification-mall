<template>
  <div class="wrapper">
    <div style="background-color:red;line-height:100px" @click="aaa2()">div</div>
    <ul class="content">
      <button @click="aaa()">按钮</button>
      <li>aaa1</li>
      <li>aaa2</li>
      <li>aaa3</li>
      <li>aaa4</li>
      <li>aaa5</li>
      <li>aaa6</li>
      <li>aaa7</li>
      <li>aaa8</li>
      <li>aaa9</li>
      <li>aaa10</li>
      <li>aaa11</li>
      <li>aaa12</li>
      <li>aaa13</li>
      <li>aaa14</li>
      <li>aaa15</li>
      <li>aaa16</li>
      <li>aaa17</li>
      <li>aaa18</li>
      <li>aaa19</li>
      <li>aaa20</li>
      <li>aaa21</li>
      <li>aaa22</li>
      <li>aaa23</li>
      <li>aaa24</li>
      <li>aaa25</li>
      <li>aaa26</li>
      <li>aaa27</li>
      <li>aaa28</li>
      <li>aaa29</li>
      <li>aaa30</li>
      <li>aaa31</li>
      <li>aaa32</li>
      <li>aaa33</li>
      <li>aaa34</li>
      <li>aaa35</li>
      <li>aaa36</li>
      <li>aaa37</li>
      <li>aaa38</li>
      <li>aaa39</li>
      <li>aaa40</li>
      <li>aaa41</li>
      <li>aaa42</li>
      <li>aaa43</li>
      <li>aaa44</li>
      <li>aaa45</li>
      <li>aaa46</li>
      <li>aaa47</li>
      <li>aaa48</li>
      <li>aaa49</li>
      <li>aaa50</li>
      <li>aaa51</li>
      <li>aaa52</li>
      <li>aaa53</li>
      <li>aaa54</li>
      <li>aaa55</li>
      <li>aaa56</li>
      <li>aaa57</li>
      <li>aaa58</li>
      <li>aaa59</li>
      <li>aaa60</li>
      <li>aaa61</li>
      <li>aaa62</li>
      <li>aaa63</li>
      <li>aaa64</li>
      <li>aaa65</li>
      <li>aaa66</li>
      <li>aaa67</li>
      <li>aaa68</li>
      <li>aaa69</li>
      <li>aaa70</li>
      <li>aaa71</li>
      <li>aaa72</li>
      <li>aaa73</li>
      <li>aaa74</li>
      <li>aaa75</li>
      <li>aaa76</li>
      <li>aaa77</li>
      <li>aaa78</li>
      <li>aaa79</li>
      <li>aaa80</li>
      <li>aaa81</li>
      <li>aaa82</li>
      <li>aaa83</li>
      <li>aaa84</li>
      <li>aaa85</li>
      <li>aaa86</li>
      <li>aaa87</li>
      <li>aaa88</li>
      <li>aaa89</li>
      <li>aaa90</li>
      <li>aaa91</li>
      <li>aaa92</li>
      <li>aaa93</li>
      <li>aaa94</li>
      <li>aaa95</li>
      <li>aaa96</li>
      <li>aaa97</li>
      <li>aaa98</li>
      <li>aaa99</li>
      <li>aaa100</li>
    </ul>
  </div>
</template>

<script>
  import BScroll from '@better-scroll/core'
  import Pullup from '@better-scroll/pull-up'

  BScroll.use(Pullup)

  export default {
    name:"Classify",
    data(){
      return{
        bs:null,
      }
    },
    created(){
      console.log("Classify.vue is created:"+new Date().getTime());
    },
    mounted(){
      console.log("Classify.vue is mounted:"+new Date().getTime());
      // 这种情况,bs就只能在一个函数中使用
      // let bs = new BScroll('.wrapper',{
      //   probeType:3,
      // });
      // bs.on("scroll",(position)=>{
      //   console.log(position);
      // });

      this.BScroll();
    },
    methods:{
      BScroll(){
        this.bs = new BScroll('.wrapper',{
          probeType:3,
          pullUpLoad: true,
          // batter-scroll在vue里面阻止了button以外的元素的点击,但是html里面不会
          click:true
        });
        this.bs.on("scroll",(position)=>{
          // console.log(position);
        });
        this.bs.on("pullingUp",()=>{
          console.log("上拉刷新咯!");
          this.bs.finishPullUp();
        });
      },
      aaa(){
        console.log("按钮点击了");
      },
      aaa2(){
        console.log("div点击了");
      },
    }
  }
</script>

<style scoped>
  .wrapper{
    height: 200px;
    background-color: aqua;
    overflow: hidden;
  }
</style>