# 描述 -- devPhone10分支
该分支(devPhone9之后),对首页和详情页的完善,修改了一部分东西(比较零散,不好说)! 解决了轮播图只有一张图时出现轮播点的bug ; 知道了防抖函数的利弊,如果加载速度快,但是加载的东西很多,而界面是需要靠防抖中的函数来刷新的,那么可能出现很长时间一直在重置,而导致一开始界面无法刷新(这里的batter-scroll就是这样,具体见Detail.vue) ; 没有写评论组件,因为感觉都是差不多的,除了一个时间戳的转化(filters),在截图36里面,自己可以看看思路 ; 了解了混入,但是因为代码bug(已解决)没有写,有兴趣可以自己看截图36里面(改正bug后,发现代码不一样,不适合混入) ; 知道了事件总线有$on,$emit.$off三个($off没有什么用,会有bug)
<br/>
学会了:
1. 较为复杂(有很多图品加载\很长)的滚动才需要用batter-scroll,不然用了比不用bug更多
2. 再一次用到了事件总线,和视频不一样,个人感觉事件总线加防抖要好一点
3. 传递参数不能用驼峰,如果是驼峰,要写成xxxx-xxxx
4. 知道了keep-alive的exclude是靠的name排除的,而不是vue文件的名字
5. 复习了计算属性
6. 监听图片加载时不能延时
7. 复习了Object.keys()方法,可以用于判断界显示
8. 知道了平时写代码时,一定要注意判断变量是否存在,不然会产生bug,具体可以看Scroll.vue的封装,常用于多次调用且顺序不定的情况
9. 事件总线不能两个地方监听同一个名字,不然会产生影响,例如:Detail.vue和Home.vue,写推荐后,就会产生回到首页返回顶部的bug ===> [解决方案,离开页面时取消监听$bus.$off(),Detail.vue和Home.vue都要加] (X)  ; 正确做法,根据路由判断后返回两个不一样的事件名称来分别监听
10. 没有缓存(keep-alive)的界面没有deactivated这个钩子

## 开发注意事项
1. 记得删除.git文件,以免无法和自己的库连接
2. .editorconfig文件如果不需要请删除
3. 里面的四个css规范化,是非常友好的,而且引用顺序也是我排好的,不建议修改顺序,代码有不合适自己的可以修改并保存为自己的哟!
4. 如果感觉打印那么多很麻烦,建议理解后注释或删除

## 注意
a.txt文件是为了能上传到github才创建的,里面是介绍文件夹应该放什么东西
<br/>
老师视频:https://www.bilibili.com/video/BV15741177Eh?p=168&spm_id_from=pageDriver
<br/>
还有一个bug,就是tabControl滚动后,点击其它的选项,也会显示滚动后的位置,现在我暂时没想到思路,要是后面视频讲了我就按照老师的来,没讲我就自己写一写,可能需要改变页面的数据结构

