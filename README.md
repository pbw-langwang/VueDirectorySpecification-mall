# 描述 -- devPhone15_try分支
该分支(devPhone14之后), 尝试把字体随页面变化的函数取消(/public/index.js),使用打包的工具(postcss-px-to-viewport)

### 学会了:
1. 通过设计稿,加上这个postcss-px-to-viewport工具,可以很方便的实现适配 --> 代码按设计稿的px设置,该%的时候还是%,打包后会转化为vw

### 使用方式:
1. 安装 npm install postcss-px-to-viewport --save
2. 配置文件postcss.config.js
3. 然后自己修改样式使其更加好看

## 开发注意事项
1. 如果感觉打印那么多很麻烦,建议理解后注释或删除

