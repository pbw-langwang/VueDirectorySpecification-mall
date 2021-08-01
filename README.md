# 描述 -- devPhone7分支
该分支(devPhone6之后), 该代码进一步对昨天的生命周期进行了测试,发现果然网络请求是发生在app.vue执行mounted之后,原因也很简单,只有等整个项目挂载完成之后才能进行下一步的操作,即使是写在app.vue的created里面的网络请求,依旧是app.vue执行mounted之后才请求
<br/>
第二:进一步测试了batter-scroll的click参数的作用情况,见Classify文件夹,大致就是html中,其可以监听所有的元素的点击事件,但是到vue中就不行,需要加上click参数
<br/>
第三:封装了点击回到顶部的组件,知道了.native的使用情况,img/components文件的的结构更加清楚
<br/>
学会了:
1. 封装的组件要有独立性,要封装好,可以看Scroll.vue的methods
2. 网络请求的封装建议看home.vue,一顺看到request.js
3. ref的使用较为频繁
4. 还有一些传值和封装的思想,受益匪浅

## 开发注意事项
1. 记得删除.git文件,以免无法和自己的库连接
2. .editorconfig文件如果不需要请删除
3. 里面的四个css规范化,是非常友好的,而且引用顺序也是我排好的,不建议修改顺序,代码有不合适自己的可以修改并保存为自己的哟!
4. 如果感觉打印那么多很麻烦,建议理解后注释或删除
5. 今天再奉上我看视频的截图,感觉都是重点,见:vue看视频截图

## 注意
a.txt文件是为了能上传到github才创建的,里面是介绍文件夹应该放什么东西

老师视频:https://www.bilibili.com/video/BV15741177Eh?p=168&spm_id_from=pageDriver

下一版(devPhone8)再来解决bug,今天时间不够了

