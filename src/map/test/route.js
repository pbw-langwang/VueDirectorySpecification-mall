const route = [
  {
    path: "/test",
    name: "test",
    component: () => import("./test.vue"),
    redirect: { name: "t_map" },
    children: [
      {
        path: "map",
        name: "t_map",
        component: () => import("./components/map.test.vue")
      },
      {
        path: "map_url_arcgis",
        name: "t_map_url_arcgis",
        component: () => import("./components/map.url.arcgis.test.vue")
      },
      {
        path: "map_url_arcgis_customproject",
        name: "t_map_url_arcgis_customproject",
        component: () =>
          import("./components/map.url.arcgis.customproject.test.vue")
      },
      {
        path: "map_url_geoserver",
        name: "t_map_url_geoserver",
        component: () => import("./components/map.url.geoserver.test.vue")
      },
      {
        path: "map_url_xyz",
        name: "t_map_url_xyz",
        component: () => import("./components/map.url.xyz.test.vue")
      },
      {
        path: "map_url_wms",
        name: "t_map_url_wms",
        component: () => import("./components/map.url.wms.test.vue")
      },
      {
        path: "map_layer_stamen",
        name: "t_map_layer_stamen",
        component: () => import("./components/map.layer.stamen.test.vue")
      },
      {
        path: "map_geojson",
        name: "t_map_geojson",
        component: () => import("./components/map.json.test.vue")
      },
      {
        path: "map_geojson_image",
        name: "t_map_geojson_image",
        component: () => import("./components/map.json.image.test.vue")
      },
      {
        path: "map_multi_geojson",
        name: "t_map_multi_geojson",
        component: () => import("./components/map.multi.json.test.vue")
      },
      {
        path: "map_geojson_cluster",
        name: "t_map_geojson_cluster",
        component: () => import("./components/map.json.cluster.test.vue")
      },
      {
        path: "map_data_wkt",
        name: "t_map_data_wkt",
        component: () => import("./components/map.data.wkt.test.vue")
      },
      {
        path: "map_json_shp",
        name: "t_map_json_shp",
        component: () => import("./components/map.json.shp.test.vue")
      },
      {
        path: "map_heat",
        name: "t_map_heat",
        component: () => import("./components/map.heat.test")
      },
      {
        path: "map_json_table",
        name: "t_map_json_table",
        component: () => import("./components/map.json.table.test.vue")
      },
      {
        path: "map_measure",
        name: "t_map_measure",
        component: () => import("./components/map.measure.test.vue")
      },
      {
        path: "map_buffer",
        name: "t_map_buffer",
        component: () => import("./components/map.buffer.test.vue")
      },
      {
        path: "map_control_swipe",
        name: "t_map_control_swipe",
        component: () => import("./components/map.control.swipe.test.vue")
      },
      {
        path: "map_control_multiMap",
        name: "t_map_control_multiMap",
        component: () => import("./components/map.control.multiMap.test.vue")
      },
      {
        path: "map_control_timeLine",
        name: "t_map_control_timeLine",
        component: () => import("./components/map.control.timeLine.test")
      },
      {
        path: "map_control.contextmenu",
        name: "t_map_control.contextmenu",
        component: () => import("./components/map.control.contextmenu.test.vue")
      },
      {
        path: "map.control.legend",
        name: "t_map.control.legend",
        component: () => import("./components/map.control.legend.test.vue")
      },
      {
        path: "map.control.around",
        name: "t_map.control.around",
        component: () => import("./components/map.control.around.test.vue")
      },
      {
        path: "map.control.frame",
        name: "t_map.control.frame",
        component: () => import("./components/map.control.frame.test.vue")
      },
      {
        path: "map.control.block",
        name: "t_map.control.block",
        component: () => import("./components/map.control.block.test.vue")
      },
      {
        path: "map.control.export",
        name: "t_map.control.export",
        component: () => import("./components/map.control.export.test.vue")
      },
      {
        path: "map_basemap",
        name: "t_map_basemap",
        component: () => import("./components/map.basemap.test.vue")
      },
      {
        path: "map_pointer",
        name: "t_map_pointer",
        component: () => import("./components/map-pointer.test.vue")
      },
      {
        path: "map_layer_manage",
        name: "t_map_layer_manage",
        component: () => import("./components/map.layer.manage.test.vue")
      },
      {
        path: "map_city",
        name: "t_map_city",
        component: () => import("./components/map.city.test.vue")
      },
      {
        path: "map_draw",
        name: "t_map_draw",
        component: () => import("./components/map.draw.test.vue")
      },
      {
        path: "map_query.normal",
        name: "t_map_query.normal",
        component: () => import("./components/map.query.normal.test.vue")
      },
      {
        path: "map_query.spatial",
        name: "t_map_query.spatial",
        component: () => import("./components/map.query.spatial.test.vue")
      },
      {
        path: "map_query.hgt.properties",
        name: "t_map_query.hgt.properties",
        component: () =>
          import("./components/map.query.hgt.properties.test.vue")
      },
      {
        path: "map.query.hgt.spatial",
        name: "t_map.query.hgt.spatial",
        component: () => import("./components/map.query.hgt.spatial.test.vue")
      },
      {
        path: "map.animation.track",
        name: "t_map.animation.track",
        component: () => import("./components/map.animation.track.test.vue")
      }
    ]
  }
];

export default route;
