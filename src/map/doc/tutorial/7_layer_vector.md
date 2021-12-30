# 矢量数据图层

## 数据源 dataSource

### JSON/GeoJSON

geometryType: 'Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection', 'Circle'

```js
// List
dataSource = {
  type: "1",
  geometryKey: "geometryType", // 默认为"type"
  idKey:"id", // 默认为"id"
  data:[{
    geometryType: "Point",
    coordinates: [110.7, 31.6],
    id:"1"
  }]
}

// Feature Object
dataSource = {
  type: "2",
  data: {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [110.6, 31.58]
    },
    properties: {
      prop0: "value0",
    }
  }
};

// FeatureCollection
dataSource = {
  type: "3",
  data: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [110.9, 31.58]
        },
        properties: {
          prop0: "value0",
        }
      },
    ]
  }
};

// geojson 文件
dataSource = {
  type: "4",
  data: "data/geojson.geojson" // 文件地址
};
```

### WKT

```js
// List
dataSource = {
  type: "1",
  geometryKey: "geometry"
  data:[
    geometry: "POINT(110.61260986 31.60690428)"
  ]
}
```

## 通用控件

```js
import MyMapVectorJson from "@map/components/my-map-vector/Json";
```

```vue
<template>
  <my-map>
    <MyMapVectorJson :dataSource="dataSource"></MyMapVectorJson>
  </my-map>
</template>
```

### 控件属性

| 属性          | 值                        | 说明                                  |
|---------------|---------------------------|-------------------------------------|
| dataSource    | Object                    | 数据源                                |
| dataType      | String, "json"            | 数据类型，"json","wkt"                 |
| name          | String                    | 图层名称                              |
| id            | String                    | 图层 id                               |
| zindex        | Number， 0                 | 显示索引                              |
| isFit         | Boolean, false            | 是否根据数据源调整视图                |
| fitOption     | Number， 0                 | 跳转参数，参照 ol/View.fit()方法说明   |
| styles        | [Object, Array, Function] | 矢量要素的样式                        |
| hoverStyles   | [Object, Array, Function] | 鼠标悬浮矢量要素时的样式              |
| isVectorImage | Boolean, false            | 以图片方式渲染数据，大数据量时推荐使用 |

### 控件方法

1、图层操作 component.layer 参照 ol/layer/Base
2、数据源操作 component.source 参照 ol/source/Vector

| 方法                            | 说明                 |
|---------------------------------|--------------------|
| addData(dataSource)             | 添加数据源           |
| getItems(key, value)            | 获取矢量要素         |
| fit()                           | 跳转                 |
| clear()                         | 清除数据             |
| setStyles(styles)               | 设置图层要素样式     |
| setHoverStyles(styles)          | 设置图层要素悬浮样式 |
| setFeatureStyle(feature, style) | 设置要素样式         |

## 聚合图层控件

```js
import MyMapVectorCluster from "@map/components/my-map-vector/Cluster";
```

```vue
<template>
  <my-map>
    <MyMapVectorCluster :dataSource="dataSource"></MyMapVectorCluster>
  </my-map>
</template>
```

### 控件属性

| 属性        | 值                        | 说明                                |
|-------------|---------------------------|-----------------------------------|
| dataSource  | Object                    | 数据源                              |
| dataType    | String, "json"            | 数据类型，"json","wkt"               |
| name        | String                    | 图层名称                            |
| id          | String                    | 图层 id                             |
| zindex      | Number， 0                 | 显示索引                            |
| isFit       | Boolean, false            | 是否根据数据源调整视图              |
| fitOption   | Number， 0                 | 跳转参数，参照 ol/View.fit()方法说明 |
| styles      | [Object, Array, Function] | 矢量要素的样式                      |
| hoverStyles | [Object, Array, Function] | 鼠标悬浮矢量要素时的样式            |
| isCluster   | Boolean, false            | 是否聚合                            |
| distance    | Number,20                 | 聚合距离                            |
| numOffsetX  | Number,10                 | 数字 X 偏移量                       |
| numOffsetY  | Number,10                 | 数字 Y 偏移量                       |
