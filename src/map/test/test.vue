<template>
  <div class="container">
    <div class="left">
      <router-link to="/test/map">地图</router-link>
      <div class="title">地图服务</div>
      <router-link to="/test/map_url_arcgis">ArcGIS Server服务</router-link>
      <router-link to="/test/map_url_arcgis_customproject"
        >ArcGIS Server服务(自定义坐标系)</router-link
      >
      <router-link to="/test/map_url_geoserver">Geoserver服务</router-link>
      <router-link to="/test/map_url_xyz">XYZ服务</router-link>
      <router-link to="/test/map_url_wms">通用wms</router-link>
      <router-link to="/test/map_layer_stamen">stamen 图层</router-link>
      <div class="title">矢量数据</div>
      <router-link to="/test/map_geojson">json数据</router-link>
      <router-link to="/test/map_geojson_image">json数据(图片渲染)</router-link>
      <router-link to="/test/map_multi_geojson">json数据（多层）</router-link>
      <router-link to="/test/map_geojson_cluster">json数据(聚合)</router-link>
      <router-link to="/test/map_data_wkt">wkt数据</router-link>
      <router-link to="/test/map_json_shp">shp数据</router-link>
      <router-link to="/test/map_heat">热力图</router-link>
      <router-link to="/test/map_json_table">图属联动</router-link>
      <div class="title">工具</div>
      <router-link to="/test/map_measure">测量</router-link>
      <router-link to="/test/map_buffer">缓冲区</router-link>
      <router-link to="/test/map_control_swipe">卷帘</router-link>
      <router-link to="/test/map_control_multiMap">多窗口</router-link>
      <router-link to="/test/map_control_timeLine">时间轴</router-link>
      <router-link to="/test/map_control.contextmenu">右键菜单</router-link>
      <router-link to="/test/map.control.legend">arcgis图例</router-link>
      <router-link to="/test/map.control.around">周边搜索</router-link>
      <router-link to="/test/map.control.frame">标准分幅</router-link>
      <router-link to="/test/map.control.block">分块(按公里)</router-link>
      <router-link to="/test/map.control.export">导出图片</router-link>
      <div class="title">控件</div>
      <router-link to="/test/map_basemap">底图切换</router-link>
      <router-link to="/test/map_pointer">位置指示器</router-link>
      <router-link to="/test/map_layer_manage">图层管理</router-link>
      <router-link to="/test/map_city">城市</router-link>
      <div class="title">绘制</div>
      <router-link to="/test/map_draw">几何要素工具</router-link>
      <div class="title">查询</div>
      <router-link to="/test/map_query.normal">arcgis属性查看</router-link>
      <router-link to="/test/map_query.spatial">arcgis空间查询</router-link>
      <router-link to="/test/map_query.hgt.properties"
        >公司服务属性查看</router-link
      >
      <router-link to="/test/map.query.hgt.spatial"
        >公司服务空间查询</router-link
      >
      <div class="title">动画</div>
      <router-link to="/test/map.animation.track">历史轨迹</router-link>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 0;
  margin: 0;
  display: inline-grid;
  grid-template-columns: 150px 1fr;
}

.left > * {
  display: block;
}

.left > .title {
  font-weight: bold;
  font-size: 20px;
}
</style>
