# 地图服务图层

# 参数LayerParams

## ArcGIS 地图服务

| 属性   | 值               | 说明                                         |
|--------|------------------|--------------------------------------------|
| \*type | String, "arcgis" | 服务类型                                     |
| \*url  | String           | 地图服务地址、字符串                          |
| extent | Array            | 地理空间范围，坐标为经纬度坐标(新增,三维使用) |

### ArcGIS WMS 服务（可选）

| 属性         | 值      | 说明                                                 |
|--------------|---------|----------------------------------------------------|
| layers       | String  | 显示指定图层,多图层用“,”隔开，如"0,1"                 |
| projection   | String  | 坐标系                                               |
| crossOrigin  | Boolean | 截图时使用，设置为 true 系                            |
| imageOptions | Object  | ol/layer/image 其他参数                              |
| restOption   | Object  | 其他 ArcGIS Rest parameters Service，扩展服务请求参数 |

### ArcGIS WMTS 服务（可选）

| 属性        | 值      | 说明                      |
|-------------|---------|-------------------------|
| tileGrid    | Object  | ol/tilegrid/WMT 参数      |
| projection  | String  | 坐标系                    |
| crossOrigin | Boolean | 截图时使用，设置为 true 系 |
| tileOptions | Object  | ol/layer/tile 其他参数    |
| xyzOptions  | Object  | ol/source/xyz 其他参数    |

## GeoServer 地图服务

| 属性       | 值                  | 说明                                         |
|------------|---------------------|--------------------------------------------|
| \*type     | String, "geoserver" | 服务类型                                     |
| \*url      | String              | 地图服务地址                                 |
| \*layers   | String              | 图层名                                       |
| projection | String,"EPSG:3857"  | 坐标系                                       |
| extent     | Array               | 地理空间范围，坐标为经纬度坐标(新增,三维使用) |

### GeoServer WMS 服务

| 属性         | 值      | 说明                            |
|--------------|---------|-------------------------------|
| crossOrigin  | Boolean | 截图时使用，设置为 true 系       |
| imageOptions | Object  | ol/layer/image 其他参数         |
| restOption   | Object  | WMS request parameters 其他参数 |

### GeoServer WMTS 服务

| 属性             | 值                   | 说明                              |
|------------------|----------------------|---------------------------------|
| \*matrixSet      | String               | 切片方案名称                      |
| tileMatrixLabels | Array, [1,2,3,……，18] | 切片方案的索引名称（新增,三维使用） |
| crossOrigin      | Boolean              | 截图时使用，设置为 true 系         |
| format           | "image/png"          | 图片格式                          |

## XYZ 地图服务

| 属性        | 值                 | 说明                                         |
|-------------|--------------------|--------------------------------------------|
| \*type      | String, "xyz"      | 服务类型                                     |
| \*url       | String             | 地图服务地址、字符串                          |
| projection  | String,"EPSG:3857" | 坐标系                                       |
| tileGrid    | Object             | ol/tilegrid/WMT 参数                         |
| crossOrigin | Boolean            | 截图时使用，设置为 true 系                    |
| tileOptions | Object             | ol/layer/tile 其他参数                       |
| xyzOptions  | Object             | ol/source/xyz 其他参数                       |
| extent      | Array              | 地理空间范围，坐标为经纬度坐标(新增,三维使用) |

## 通用的 WMS 服务

| 属性         | 值                 | 说明                                         |
|--------------|--------------------|--------------------------------------------|
| \*type       | String, "wms"      | 服务类型                                     |
| \*url        | String             | 地图服务地址、字符串                          |
| projection   | String,"EPSG:3857" | 坐标系                                       |
| crossOrigin  | Boolean            | 截图时使用，设置为 true 系                    |
| imageOptions | Object             | ol/layer/image 其他参数                      |
| \*restOption | Object             | 扩展服务请求参数，{layers:""} layers 必参     |
| extent       | Array              | 地理空间范围，坐标为经纬度坐标(新增,三维使用) |

## 公司服务

| 属性         | 值                 | 说明                                                                      |
|--------------|--------------------|-------------------------------------------------------------------------|
| \*type       | String, "hgt"      | 服务类型                                                                  |
| \*url        | String             | 地图服务地址、字符串                                                       |
| projection   | String,"EPSG:3857" | 坐标系                                                                    |
| crossOrigin  | Boolean            | 截图时使用，设置为 true 系                                                 |
| imageOptions | Object             | ol/layer/image 其他参数                                                   |
| \*restOption | Object             | 扩展服务请求参数，{layerid:""，dataType："",basemapType: ""}  与相关人员对接 |
| extent       | Array              | 地理空间范围，坐标为经纬度坐标(新增,三维使用)                              |

# 方法

参考ol​/layer​/Base对象
