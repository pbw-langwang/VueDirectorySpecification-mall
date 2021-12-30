# 准备

本章介绍使用 map 库开发地图应用之前的一些准备工作

# 导入项目

- 方式一：复制文件夹 dx-map/map
- 方式二：svn 导入 http://192.168.100.100:9999/svn/hgt/dx-map/map

# 添加配置

1、设置文件相对位置

```js
  alias: {
    "@map": path.resolve(__dirname, "map")
  }
```

2、安装相应的包

- 必装：ol、proj4
- 使用 map/components 组件：vue@2.6.11、element-ui、less、less-loader
- 使用 map/js/analysis 方法：@turf/turf

# 准备页面

1、添加 **div** 标签作为地图容器；

```html
<div class="map-container"></div>
```

2、为地图容器指定高度、宽度；

```css
.map-container {
  width: 500px;
  height: 500px;
}
```
