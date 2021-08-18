# 描述 -- devPhone14分支
该分支(devPhone13之后), 把CartBomNav进行了一点修改 ; 写好了全选按钮 ; 封装了toast弹窗(插件形式) 

## 学会了:
1. 高阶函数,数组/对象的操作函数,都非常重要,要记住!!! (我总是感觉会查就行了,但是现在感觉最好记住)
2. vuex的dispatch可以返回一个promise对象!!! --> 写在actions里面
3. vuex的mapGetters的两种写法,见:ShopCart.vue,对象-->重定义名字;数组-->直接使用 [mapGetters映射vuex的getters方法]
4. vuex的mapActions,见:Detail.vue [mapActions映射vuex的actions方法]
5. 了解到了插件的封装方式,见:toast文件夹 --> 很重要,有利于看别人封装的东西,vue.use()会去对应的文件夹里找index.js,并且会执行里面的install
6. fastclick/vue-lazyload --> 两个库,视频讲了一点,我没有写,先知道今后有用就好找

## 开发注意事项
1. 如果感觉打印那么多很麻烦,建议理解后注释或删除

## 注意
老师视频:https://www.bilibili.com/video/BV15741177Eh?p=168&spm_id_from=pageDriver
<br/>
<br/>
还有一个bug,就是tabControl滚动后,点击其它的选项,也会显示滚动后的位置,现在我暂时没想到思路,要是后面视频讲了我就按照老师的来,没讲我就自己写一写,可能需要改变页面的数据结构

