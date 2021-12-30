# 快速上手

按照「准备」篇完成页面准备工作之后就可以真正开始地图的开发工作了。

# 初始化地图

引用组件"@map/components/my-map/Map",默认显示 OSM 地图

```js
<template>
  <div class="map-container">
    <my-map ref="mapCom" style="width:1500px;height:800px"></my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";

export default {
  components: {
    MyMap
  }
};
</script>
```

# 配置视图、底图

采用配置文件的导入

```html
<!-- public/index.html -->
<script src="./config.js"></script>
```

```js
// public/config.ks
window.global = {
  view: {
    zoom: 11,
    center: [110.5, 31.58]
  },
  layers: [
    {
      name: "矢量",
      icon: "",
      data: [
        {
          type: "xyz",
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
          projection: "EPSG:3857"
        },
        {
          type: "xyz",
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
          projection: "EPSG:3857"
        }
      ]
    },
    {
      name: "栅格",
      icon: "",
      data: [
        {
          type: "xyz",
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
          projection: "EPSG:3857"
        },
        {
          type: "xyz",
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
          projection: "EPSG:3857"
        }
      ]
    }
  ]
};
```

# 添加图层 —— 地图服务

1、组件添加 **ref** 属性

```js
<my-map ref="mapCom"></my-map>
```

2、构建地图服务参数

```js
let params = {
  type: "arcgis",
  url: "http://192.168.99.56:6080/arcgis/rest/services/SNJ/river/MapServer"
};
```

3、调用方法

```js
let map = this.$refs.mapCom.map;
await map.addImageLayer(params);
```

# 添加图层 —— 矢量数据

1、添加组件 ""@map/components/my-map-vector/Json"

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

2、赋值数据

```js
dataSource = {
  type: "1", // List
  data: [
    {
      geometryType: "Point",
      coordinates: [110.6, 31.6]
    }
  ],
  geometryKey: "geometryType"
};
```

# 捕捉矢量数据和信息窗体

1、申明 selectFeature
2、组件 MyMapVectorJson 添加 click 事件
组件 MyMap 添加 nullselect 事件
3、引用弹出框组件"@map/components/my-map-overlay/Popup"
4、计算信息窗体的内容

```vue
<template>
  <my-map @nullselect="clearSelectFeature">
    <MyMapVectorJson :dataSource="dataSource" @click="handleClick">
    </MyMapVectorJson>
    <MyMapPopup ref="popup">
      <!-- 弹出框的具体显示内容 -->
      <div v-if="info">{{ info.id }}</div>
    </MyMapPopup>
  </my-map>
</template>
```

2、click 方法

```js
export default {
  data() {
    return {
      selectFeature: null
    };
  },
  computed: {
    info() {
      // 获取详情
      if (this.selectFeature) {
        return this.selectFeature.getProperties();
      }
      return null;
    }
  },
  methods: {
    handleClick(e, feature) {
      if (feature) {
        this.selectFeature = feature;
        this.$refs.popup.show(e.coordinate);
      }
    },
    clearSelectFeature() {
      this.selectFeature = null;
    }
  }
};
```
