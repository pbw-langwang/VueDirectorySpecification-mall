// 几何类型："Point", "MultiPoint", "LineString", "MultiLineString", "Polygon","MultiPolygon",

// list结构
export const geoList = [
  {
    id: "0",
    geometryType: "Point",
    coordinates: [110.7, 31.6],
    prop0: "value0"
  },
  {
    id: "1",
    geometryType: "Point",
    coordinates: [110.8, 31.7],
    prop0: "value0"
  },
  {
    id: "2",
    geometryType: "Point",
    coordinates: [110.9, 31.62],
    prop0: "value0"
  }
];

export const geoListCluster = [
  {
    id: "0",
    geometryType: "Point",
    coordinates: [110.6, 31.6],
    prop0: "value0"
  },
  {
    id: "1",
    geometryType: "Point",
    coordinates: [110.5, 31.61],
    prop0: "value0"
  }
];

// 完整的geojson 结构  FeatureCollection
export const jsonFeatureCollection = {
  type: "FeatureCollection",
  crs: {
    type: "name",
    properties: {
      name: "EPSG:4326"
    }
  },
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [110.9, 31.58]
      },
      properties: {
        prop0: "value0",
        prop1: 0.0
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [110.6, 31.5],
            [111, 31.5],
            [111, 32],
            [110.6, 32],
            [110.6, 31.5]
          ]
        ]
      },
      properties: {
        prop0: "value0",
        prop1: 0.0
      }
    }
  ]
};

// 单个要素 Feature
export const jsonFeature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [110.6, 31.58]
  },
  properties: {
    prop0: "value0",
    prop1: 0.0
  }
};
