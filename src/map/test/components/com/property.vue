<template>
  <div class="table-container">
    <div class="table-main">
      <el-table
        :data="list"
        stripe
        border
        size="small"
        height="100%"
        :highlight-current-row="true"
        tooltip-effect="dark"
        style="width: 100%"
        @row-click="rowClickEvent"
      >
        <el-table-column
          v-for="(value, name) in alias"
          :key="name"
          :prop="name"
          :label="value"
          :show-overflow-tooltip="true"
          sortable
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        background
        layout="prev, pager, next,total"
        :current-page="pageIndex"
        :page-size="pageSize"
        :total="sum"
        :hide-on-single-page="true"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    alias: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    sum: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      pageIndex: 1
    };
  },
  mounted() {},
  methods: {
    rowClickEvent(row) {
      this.$emit("row-click", row);
    },
    pageChange(value) {
      this.pageIndex = value;
      this.$emit("change", { pageIndex: value, pageSize: this.pageSize });
    }
  }
};
</script>

<style lang="less" scoped>
.table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .table-main {
    flex: 1;
  }
  .page-container {
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
