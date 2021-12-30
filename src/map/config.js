const config = window.global;

const view = config ? config.view : null;
const layers = config ? config.layers : null;

// 视图配置
export const CONFIG_VIEW = {
  ...view,
  projection: "EPSG:3857"
};

// 底图配置
export const CONFIG_LAYERS = layers || [
  [
    {
      type: "xyz",
      url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    }
  ]
];

//#region 城市控件配置

// 城市控件最上级名称
export const cities_top_name = "全国";

// 城市控件类型
export const cities_type = [
  {
    name: "按省份",
    key: "provinceByLetter"
  },
  {
    name: "按城市",
    key: "cityByLetter"
  }
];
// 城市shp服务
export const cities_mapServer = {
  url: "http://192.168.99.56:6080/arcgis/rest/services/common/cities/MapServer",
  id: 0,
  codeKey: "市代码",
  nameKey: "市",
  projection: "EPSG:4326"
};

//#endregion
