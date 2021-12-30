# 控件

## 基础控件

```js
import { zoomIn, zoomOut, toggleFullScreen } from "@map/js/tool/baseTool";

// 放大
zoomIn(map);

// 缩小
zoomOut(map);

// 全屏
toggleFullScreen(element); // element为HTML元素，默认为document.body
```

## 测量

```vue
<template>
  <div>
    <my-map ref="mapCom"> </my-map>
    <div>
      <button @click="measureEvent('Polygon')">测面</button>
      <button @click="measureEvent('LineString')">测量</button>
      <button @click="clear">清除</button>
    </div>
  </div>
</template>

<script>
import Measure, { clearMeasure } from "@map/js/tool/measure";

export default {
  components: {
    MyMap
  },
  data() {
    return {
      measures: []
    };
  },
  methods: {
    measureEvent(type) {
      let map = this.$refs.mapCom.map;
      let measure = new Measure({ map, type });
      this.measures.push(measure);
    },
    clear() {
      this.measures.forEach(x => {
        clearMeasure(x);
      });
      this.measures = [];
    }
  }
</script>
```
