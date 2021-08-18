module.exports ={
  plugins:{
    autoprefixer:{},
    "postcss-px-to-viewport":{
      viewportWidth:375, //视窗的宽度(对应的是我们设计稿的宽度)
      viewportHeight:667, //视窗的高度
      unitPrecision:5, //指定"px"转换为视窗单位值的小数位数(很多时候无法整除)
      viewportUnit:"vw", //指定想要转换成的视窗单位(vw/vh),建议使用vw
      selectorBlackList:["ignore"], //指定不需要转化的类(class)-->好处,不用全部添加,而是在要忽略的上面加上ignore
      minPixelValue:10, //小于或等于5px不转换
      mediaQuery:false //允许在媒体查询中转换px
    }
  }
}