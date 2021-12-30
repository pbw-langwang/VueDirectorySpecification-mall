<template>
  <div>
    <my-map ref="mapCom" style="width:1500px;height:800px" @ready="init">
      <MyMapBlock ref="mapBlock" :cityCode="cityCode"></MyMapBlock>
    </my-map>
    <el-button type="" @click="showEvent">显示</el-button>
    <el-select v-model="cityCode" placeholder="请选择">
      <el-option
        v-for="item in citys"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div class="box" :class="{ active: isSelect }" @click="exeSelect()">
      <i
        class="fa fa-mouse-pointer"
        aria-hidden="true"
        title="点选(支持shift+鼠标左键-多选、shift+鼠标左键拖拽-框选)"
      ></i>
    </div>
    <div class="box" @click="download()">
      <i class="fa fa-download" aria-hidden="true" title="下载"></i>
    </div>
  </div>
</template>

<script>
import MyMap from "@map/components/my-map/Map";
import MyMapBlock from "@map/components/my-map-control/Block";
import Select from "@map/js/edit/select";

export default {
  components: {
    MyMap,
    MyMapBlock
  },
  data() {
    return {
      cityCode: "429021",
      citys: [
        {
          value: "429021",
          name: "神农架"
        },
        {
          value: "420100",
          name: "武汉"
        }
      ],
      isSelect: false,
      select: null,
      selectFeatures: []
    };
  },
  methods: {
    init(map) {
      map.addScaleLine({});
    },
    showEvent(){
      this.$refs.mapBlock.showLayer();
    },
    exeSelect() {
      this.isSelect = !this.isSelect;

      this.selectFeatures = [];
      if (this.isSelect) {
        if (!this.select) {
          this.select = new Select({
            map: this.$refs.mapCom.map,
            layer: this.$refs.mapBlock.getBlockLayer(),
            isTranslate: false,
            callback: features => {
              this.selectFeatures = features;
              console.log(this.selectFeatures);
            }
          });
        } else {
          this.select.active();
        }
      } else {
        this.select && this.select.deActive();
      }
    },
    download() {
      if (!this.selectFeatures || !this.selectFeatures.length) {
        this.$message.error("未选择区域！");
        return;
      }
      
      let extents = [];
      this.selectFeatures.forEach(f => {
        let extent = f.getGeometry().getExtent();
        extent = this.$refs.mapCom.map.outputExtent(extent);
        extents.push(extent);
      })
      console.log(extents);
      this.endSelect();
    },
    endSelect() {
      this.isSelect = false;
      this.selectFeatures = [];
      if (this.select) {
        this.select && this.select.deActive();
      }
    }
  }
};
</script>

<style lang="less">
.box {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  &.active {
    background: #0ff;
  }
}
</style>
