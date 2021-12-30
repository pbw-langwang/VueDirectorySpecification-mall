<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px"></my-map>
    <button @click="exportMap">导出地图</button>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import { exportMapBase64 } from "../../js/map.js";

export default {
  components: {
    MyMap
  },
  methods: {
    exportMap() {
      let map = this.$refs.mapCom.map;
      if (map) {
        exportMapBase64({
          map,
          callback: result => {
            console.log(result);

            let link = document.createElement("a");
            link.style.display = "none";
            link.href = result.image;
            link.setAttribute("download", `map.png`);
            document.body.appendChild(link);
            link.click();
            link.remove();
          }
        });
      }
    }
  }
};
</script>
