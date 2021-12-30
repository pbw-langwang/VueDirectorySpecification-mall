# 矢量要素要素 Style

支持对象、数据、函数格式

1、对象 styleObject

```js

{
  // 图标
  icon: { // 参照ol/style/Icon
    src: "", // url 地址，
  },
  // 线
  stroke:{
    color: "#000"
    width: 1,
  },
  // 填充色
  fill:{
    color: "#000"
  },
  // 圆
  circle:{
    stroke:{
      color: "#000"
      width: 1,
    },
    fill:{
      color: "#000"
    },
    radius:5,
  },
  // 文本
  text:{ // 参照ol/style/Text
    text: "文本"
  }
}
```

2、数组 styleArray = [styleObject,styleObject,styleObject,……]
3、函数 styleFunction

```js
fn = feature => {
  let name = feature.get("name");
  let active = feature.get("active");
  let styles = [];
  if (active) {
    styles.push({
      stroke: {
        color: "rgba(105,124,203,1)",
        width: 4
      }
    });
  } else {
    styles.push({
      stroke: {
        color: "rgba(219,112,147,0.8)",
        width: 4
      }
    });
  }

  if (name) {
    styles.push({
      text: {
        textAlign: "center",
        textBaseline: "middle",
        font: "normal 14px 微软雅黑",
        text: name,
        fill: { color: "#04f4f9" },
        stroke: { color: "#1a619b", width: 2 },
        offsetX: 0,
        offsetY: -20
      }
    });
  }
  return styles;
};
```
