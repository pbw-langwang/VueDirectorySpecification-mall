# 矢量要素信息窗体

## 控件

```js
import MyMapPopup from "@map/components/my-map-overlay/Popup";
```

```vue
<template>
  <my-map>
    <MyMapPopup ref="popup">
      <!-- 弹出框的具体显示内容 -->
      <div>示例</div>
    </MyMapPopup>
  </my-map>
</template>
```

### 属性

| 属性    | 值     | 说明            |
| ------- | ------ | --------------- |
| options | Object | 参照 ol/Overlay |

例：

```js
options = {
  positioning: "top-center",
  offset: [0, 0],
  autoPan: true,
  autoPanMargin: 200
};
```

### 方法

| 方法             | 说明         |
| ---------------- | ------------ |
| show(coordinate) | 指定位置弹出 |
| hide()           | 隐藏窗体     |
