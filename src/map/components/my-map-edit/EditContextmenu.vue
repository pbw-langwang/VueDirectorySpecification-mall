<template>
  <Contextmenu ref="baseContextmenu">
    <div class="my-map-edit-contextmenu">
      <ul class="context_menu">
        <li
          :class="{ disabled: disabled }"
          @click="handlerEvent($event, 'copy')"
        >
          复制
        </li>
        <li
          :class="{ disabled: !isCopy }"
          @click="handlerEvent($event, 'paste')"
        >
          粘贴
        </li>
        <li
          :class="{ disabled: disabled }"
          @click="handlerEvent($event, 'edit')"
        >
          编辑
        </li>
        <li
          :class="{ disabled: disabled }"
          @click="handlerEvent($event, 'delete')"
        >
          删除
        </li>
      </ul>
      <ul class="context_menu">
        <li
          :class="{ disabled: disabled }"
          @click="handlerEvent($event, 'fit')"
        >
          缩放到选中的要素
        </li>
        <li
          :class="{ disabled: disabled }"
          @click="handlerEvent($event, 'pan')"
        >
          跳转到选中的要素
        </li>
        <li
          :class="{ disabled: disabled }"
          @click="handlerEvent($event, 'clear')"
        >
          清除选中的要素
        </li>
      </ul>
      <ul class="context_menu">
        <li
          :class="{ disabled: disabled }"
          @click="handlerEvent($event, 'vertices')"
        >
          编辑节点
        </li>
      </ul>
    </div>

    <el-dialog
      title="粘贴"
      :visible.sync="pasteDialogVisible"
      width="30%"
      :append-to-body="true"
      custom-class="past-dialog"
    >
      <div class="label">将复制的要素粘贴到指定的图层：</div>
      <div class="select">
        图层：
        <el-select v-model="pasteLayer" placeholder="请选择">
          <el-option
            v-for="(item, index) in layers"
            :key="index"
            :label="item.name"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pasteCancel">取 消</el-button>
        <el-button type="primary" @click="pasteSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </Contextmenu>
</template>

<script>
import Contextmenu from "../my-map-control/Contextmenu";
import EditClass, { EDIT_TYPE } from "@map/js/edit/editClass";

export default {
  name: "MyMapEditContextmenu",
  components: {
    Contextmenu
  },
  inject: ["myMap"],
  props: {
    select: {
      // 选择对象 @map/js/edit/select
      type: Object,
      default: () => {
        return null;
      }
    },
    layers: {
      // 可编辑的图层
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      isCopy: false,
      copyFeatures: null,
      pasteDialogVisible: false,
      pasteLayer: null,
      editClass: null
    };
  },
  computed: {
    disabled() {
      if (this.select) {
        let len = this.select.getSelectFeatures().getLength();
        if (len) {
          return false;
        }
      }
      return true;
    }
  },
  mounted() {
    if (this.layers) {
      this.pasteLayer = this.layers[0];
    }
  },
  methods: {
    handlerEvent(event, type) {
      if (event.target.classList.contains("disabled")) {
        this.$refs.baseContextmenu.hideContextmenu();
        return;
      }

      this.handler(type);

      this.$refs.baseContextmenu.hideContextmenu();
    },
    handler(type) {
      switch (type) {
        case "copy":
          this.copyFeatures = this.select.copy();
          this.isCopy = true;
          break;
        case "paste":
          this.pasteDialogVisible = true;
          break;
        case "edit":
          this.editHandler(EDIT_TYPE.CONTROL);
          break;
        case "delete":
          this.select.delete();
          break;
        case "fit":
          this.select.fit();
          break;
        case "pan":
          this.select.pan();
          break;
        case "clear":
          this.select.clear();
          break;
        case "vertices":
          this.editHandler(EDIT_TYPE.VERTICES);
          break;
        default:
          break;
      }
    },
    pasteSubmit() {
      if (this.copyFeatures && this.pasteLayer) {
        this.pasteLayer.getSource().addFeatures(this.copyFeatures);
        this.isCopy = false;
        this.copyFeatures = null;
      }
      this.pasteDialogVisible = false;
    },
    pasteCancel() {
      this.pasteDialogVisible = false;
    },
    editHandler(type) {
      if (!this.select) {
        return;
      }
      let features = this.select.getSelectFeatures().getArray();
      if (features.length != 1) {
        this.$message.error("请选择单一的要素进行编辑");
        return;
      }

      this.editStartEvent(type, features[0]);
    },
    editStartEvent(type, feature) {
      let map = this.myMap.map;
      if (this.editClass) {
        this.editClass.init(feature);
      } else {
        let params = {
          map: map,
          feature: feature,
          type: type
        };
        this.editClass = new EditClass(params);
      }
      this.select.translate.deActive();
      map.on("click", this.editEndEvent);
      this.$refs.baseContextmenu.disposed();
    },
    editEndEvent() {
      if (this.select) {
        let translate = this.select.translate;
        translate && translate.active();
        let map = this.myMap.map;
        map.un("click", this.editEndEvent);
      }

      this.$refs.baseContextmenu.init();

      if (this.editClass) {
        this.editClass.destroy();
        this.editClass = null;
      }
    }
  },
  beforeDestroy() {
    this.editEndEvent();
  }
};
</script>

<style lang="less">
.my-map-edit-contextmenu {
  background: #fff;
  box-shadow: 0 1px 10px rgb(0 0 0 / 29%);
  user-select: none;
  .context_menu {
    width: 162px;
    padding: 9px 0;
    li {
      padding: 0 13px;
      height: 34px;
      line-height: 34px;
      cursor: pointer;
      font-size: 14px;
      color: #565656;
      word-wrap: break-word;
      &:hover {
        background-color: #f6f6f6;
      }
      &.disabled {
        cursor: not-allowed;
        color: #d3d3d3;
      }
    }

    &:not(:first-child) {
      border-top: 1px solid #ccc;
    }
  }

  ul {
    list-style: none;
    margin: 0;
  }
}

.past-dialog {
  .el-dialog__header {
    border-bottom: 1px solid #f5f5f5;
  }
  .el-dialog__body {
    padding: 10px 20px;
    .label {
      font-size: 16px;
      margin-bottom: 5px;
    }
    .select {
      .el-select {
        width: 80%;
      }
    }
  }
}
</style>
