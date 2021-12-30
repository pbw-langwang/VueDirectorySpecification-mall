# 地图右键菜单

```vue
<template>
  <div>
    <my-map ref="mapCom">
      <MyMapContextmenu @callback="setCoordinate">
        <!-- 右键菜单内容-->
        <div class="contextmenu-container">
          <div>菜单项一</div>
          <div>菜单项二</div>
        </div>
      </MyMapContextmenu>
    </my-map>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapContextmenu from "@map/components/my-map-control/Contextmenu";

export default {
  components: {
    MyMap,
    MyMapContextmenu
  },
  data() {
    return {
      coordinate: null
    };
  },
  methods: {
    setCoordinate(coordinate) {
      this.coordinate = coordinate;
    }
  }
};
</script>
```
