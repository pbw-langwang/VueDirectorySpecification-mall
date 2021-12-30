# 图层

## 地图服务图层

## 矢量图层

## 场景

1、获取图层
```js
// 根据id获取图层
getLayerByID(id) {
  let layers = map.getLayerByKey("id", id);
  if (Array.isArray(layers) && layers.length > 0) {
    let layer = layers[0];
    return layer;
  }
  return null;
}

// 根据索引值获取图层
getLayerByIndex(index) {
  let layers = map.getLayers().getArray();
  let layer = layers[index];
  return layer;
}

```


2、图层可见性

```js
// 根据图层id，修改可见状态
setLayerVisibleByID(id, bool) {
  let layer = getLayerByID(id);
  if (!layer){
    return;
  }

  if (bool != null) {
    layer.setVisible(bool);
  } else {
    layer.setVisible(!layer.getVisible());
  }
}

// 根据图层的索引值，修改可见状态
setLayerVisibleByIndex(index,bool) {
  let layer = getLayerByIndex(id);
  if (!layer){
    return;
  }
  
  if (bool != null) {
    layer.setVisible(bool);
  } else {
    layer.setVisible(!layer.getVisible());
  }
}

```

3、移除图层

```js
// 根据图层id，修改可见状态
setLayerVisibleByID(id, bool) {
  let layer = getLayerByID(id);
  if (!layer){
    return;
  }

  map.removeLayer(layer);
}

// 根据图层的索引值，修改可见状态
setLayerVisibleByIndex(index,bool) {
  let layer = getLayerByIndex(id);
  if (!layer){
    return;
  }
  
  map.removeLayer(layer);
}

