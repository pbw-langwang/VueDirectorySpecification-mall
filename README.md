# 描述 -- devPhone5分支
该分支(devPhone4之后),此分支使用了batter-scroll,其中Classify中的文件是对batter-scroll的测试以及简单的使用; 封装了scroll组件,但是发现一些问题,按照哔站视频老师的方式无法实现,需要对其**进行延时调用**.

## 学会了:
1. scoped中的样式确实是有作用域,但是类似于.content img{},这样的样式,会对其它界面产生影响,所以最好都用class表示
2. 上下区域高度确定,中间的高度可以用定位或者css的calc函数
3. 使用batter-scroll可以解决按照老师的代码,容易出现的屏幕莫名变宽现象(也可能是我的代码原因,css样式并不全是按照哔站老师所写)

## 注意
1. 老师视频: https://www.bilibili.com/video/BV15741177Eh?p=168&spm_id_from=pageDriver
2. batter-scroll: https://better-scroll.github.io/docs/zh-CN/guide/

