window.global = {
  view: {
    zoom: 11,
    center: [110.5, 31.58]
  },
  // layers先出现的图层会覆盖下面的图层
  // 每一个http代表的是不同的地图效果，见：天地图官网！
  layers: [
    {
      data: [
       {
          type: "xyz",
          // 影像底图
          url:
          "http://t{0-7}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=c96efe76d453095433f941beb574e921",
          projection: "EPSG:3857",
          // 跨域图片
          crossOrigin: true
        },
        {
          type: "xyz",
          // 地图标注
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
          projection: "EPSG:3857",
          crossOrigin: true
        },
        {
          type: "xyz",
          // 各国边界省边界
          url:
            "http://t{0-7}.tianditu.com/DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=d9160cdd3e165f779df0909d33be966d",
          projection: "EPSG:3857",
          crossOrigin: true
        },
      ]
    },
  ],
};
