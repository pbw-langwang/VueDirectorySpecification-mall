# 描述 -- devPhone7分支
该分支(devPhone6之后), 该代码进一步对昨天的生命周期进行了测试,发现果然网络请求是发生在app.vue执行mounted之后,原因也很简单,只有等整个项目挂载完成之后才能进行下一步的操作,即使是写在app.vue的created里面的网络请求,依旧是app.vue执行mounted之后才请求
<br/>
<br/>
第二:进一步测试了batter-scroll的click参数的作用情况,见Classify文件夹,大致就是html中,其可以监听所有的元素的点击事件,但是到vue中就不行,需要加上click参数
<br/>
<br/>
第三:封装了点击回到顶部的组件,知道了.native的使用情况,img/components文件的的结构更加清楚

## 学会了:
1. 封装的组件要有独立性,要封装好,可以看Scroll.vue的methods
2. ref的使用较为频繁 --> this.$refs.refname
3. 还有一些传值和封装的思想,受益匪浅

## 注意
下一版(devPhone8)再来解决bug,今天时间不够了

