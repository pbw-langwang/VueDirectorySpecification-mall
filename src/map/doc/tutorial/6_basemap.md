# 底图

## 图层组 layerGroup

说明：一个底图可以有多个图层，如天地图影像服务、天地图影像注记、行政区划等作为一个底图

结构：
1、数组 [layerParams,layerParams,layerParams,……]

2、对象，用于与底图控件组合使用

```js
{
  name:"", // 名称
  icon:"", // 图片地址
  isEarth: true, // 三维使用时，设置为true
  iconEarth: "", // 三维使用
  iconName: "", // 三维名称
  data:[layerParams,layerParams,layerParams,……]
}
```

## 底图图层组集合参数

由多个图层组组合而成 [layerGroup,layerGroup,layerGroup,……]

## 控件

```js
<template>
  <div>
    <my-map>
      <my-map-basemap></my-map-basemap>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapBasemap from "@map/components/my-map-control/Basemap";

export default {
  components: {
    MyMap,
    MyMapBasemap
  }
};
</script>

```
