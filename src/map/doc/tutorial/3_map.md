# 地图

## 组件

1、组件常用方法

| 方法                                | 说明                                     |
|-------------------------------------|----------------------------------------|
| findFeatureByCoordinate(coordinate) | 通过某一点坐标查找要素，定位，并弹出详情框 |

2、组件事件

| 方法         | 说明                          |
|--------------|-----------------------------|
| ready(map)   | 地图初始化完成后触发事件      |
| nullselect() | 点击时，未捕捉到要素时触发事件 |

## Map 对象

1、Map 对象方法 component.map

在继承 ol/Map 对象的基础上添加了如下方法：

| 方法                                           | 说明                                                              |
|------------------------------------------------|-----------------------------------------------------------------|
| getBaseLayers()                                | 获取底图图层组集合                                                |
| setBaseLayers(layers, index)                   | 设置底图图层组集合，默认显示第一个图层组                           |
| changeBaseLayer(index)                         | 切换底图图层组                                                    |
| clearBaseLayer()                               | 清除底图图层组集合                                                |
| clearBaseLayer()                               | 清除底图图层组集合                                                |
| addImageLayer(param)                           | 添加地图服务图层                                                  |
| getLayerByKey(key, value)                      | 获取图层，参数为图层对象的 key、value                               |
| getLayerIndexByKey(key, value)                 | 获取图层索引值，参数为图层对象的 key、value                         |
| swapLayerByIndex(index1, index2)               | 图层交换，参数为图层索引值，index1：交换前索引值，index2:交换后索引值 |
| getFeatureByCoordinate(coordinate, key, value) | 获取矢量要素，参数为坐标、要素的 key/value                          |
| getFeatureInView(coordinate)                   | 获取视图范围内的矢量要素，参数为坐标                               |
| addScaleLine(scaleOptions)                     | 添加比例尺，参数为 ol/control/ScaleLine 参数                       |
| addZoom()                                      | 添加放大缩小控件                                                  |
| home({ extent, zoom, center })                 | 跳转位置，输入输出坐标范围                                         |
| clear()                                        | 清除除底图外的其他所有图层及弹出来                                |
| inputCoordinate(coordinate)                    | 输入输出坐标转换为视图坐标                                        |
| inputExtent(extent)                            | 输入输出范围转换为视图范围                                        |
| outputCoordinate(coordinate)                   | 视图坐标转换为输入输出坐标                                        |
| outputExtent(extent)                           | 视图范围转换为输入输出范围                                        |

## 场景

1、定位

- 根据输入输出坐标、范围定位
  - map.home({ extent, zoom, center }) // 输入输出坐标或范围
  - map.getView().fit(extent); // 视图范围
- 根据要素或几何定位
  - map.getView().fit(feature.getGeometry());
  - map.getView().fit(geometry)
- 根据输入输出坐标查找要素定位
  - component.findFeatureByCoordinate(coordinate)

2、查找要素

```js

// 查看要素、定位并弹出详细信息
// coordinates 为输入输出坐标
viewFeature(coordinates, id, isInfo = true) {
  if (!coordinates) {
    return;
  }

  let c = map.inputCoordinate(coordinates); // 输入输出坐标转换为视图坐标 
  let feature = map.getFeatureByCoordinate(c, "id", id); // 查找要素
  if (feature) {
    // 定位
    map.getView().fit(feature.getGeometry(), {
      maxZoom: 17,
      duration: 1000,
      callback: () => {
        if (isInfo) {
          // 弹出要素事件
          // this.handleClick({ coordinate: c }, feature);
        }
      },
    });
  }
}

```