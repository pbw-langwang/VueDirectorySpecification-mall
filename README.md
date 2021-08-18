# 描述 -- devPhone分支
master分支之后, 对tabbar进行了封装

## 学会了
1. 定位时,为左右设置0,不是废话,可以让其宽度绝对为100%
2. slot最好用div框起来，不然可能某些事件因为替换而消失
3. DOM中使用别名要加上符号 ~
4. 创建的组件记得写name还有style里面的scoped
5. 复习了插槽的用法

## 开发注意事项
1. 记得删除.git文件,以免无法和自己的库连接
2. .editorconfig文件如果和您公司的要求不符合请 修改/删除
3. 里面的四个css规范化,是非常友好的,而且引用顺序也是我排好的,不建议修改顺序,代码有不合适自己的可以修改并保存为自己的
4. 注意自己根据需求,更改public中的index.html的动态改变根元素字体大小的值(建议看看devPhone15_try分支,有更好的办法)