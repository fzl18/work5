<template>
  <div class="zTable">
    <el-table
      ref="myTable"
      v-loading="tableLoading"
      :data="tableData"
      stripe
      :size="size"
      :height="height"
      :highlight-current-row="showRowHighlight"
      @current-change="handleRowChange"
      @selection-change="handleSelectionChange"
    >
      <template v-if="showSelection">
        <el-table-column width="50" type="selection" />
      </template>
      <template v-if="showIndex">
        <el-table-column
          type="index"
          :label="translateTitle('序号')"
          width="60"
        >
          <template slot-scope="scope">
            <span>
              {{ (currentPage - 1) * eachPageSize + scope.$index + 1 }}
            </span>
          </template>
        </el-table-column>
      </template>

      <template v-for="(col, index) in cols">
        <!-- prop -->
        <el-table-column
          v-if="col.prop"
          :key="index"
          :show-overflow-tooltip="col.showOverflowTooltip"
          :label="translateTitle(col.label)"
          :prop="col.prop"
          :width="col.width"
        />
        <!-- slot -->
        <el-table-column
          v-else-if="col.slot"
          :key="index"
          :show-overflow-tooltip="col.showOverflowTooltip"
          :label="translateTitle(col.label)"
          :width="col.width"
        >
          <template #default="scope">
            <slot :name="col.slot" :row="scope.row" />
          </template>
          <template v-if="col.showHeaderTip" slot="header">
            {{ col.label }}
            <el-tooltip effect="dark">
              <div slot="content">
                {{ translateTitle(col.headerContent) }}
              </div>
              <i class="ri-question-fill" />
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
      <template v-if="showHandle">
        <el-table-column
          :label="translateTitle('操作')"
          fixed="right"
          :width="handleWidth"
        >
          <template #default="scope">
            <slot name="handle" :scope="scope" :row="scope.row" />
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div v-if="showPagination" style="text-align: center; padding: 10px 0">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="eachPageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { translateTitle } from '../i18n'

export default {
  props: {
    size: {
      type: String,
      default: 'medium',
    },
    //数据
    tableData: {
      type: [Array, Object],
      required: true,
    },
    cols: {
      required: true,
      type: Array,
    },
    //总共多少条
    total: {
      type: Number,
      default: 0,
    },
    //每页多少条
    eachPageSize: {
      type: Number,
      default: 10,
    },
    //当前页码
    currentPage: {
      type: Number,
      default: 1,
    },
    //操作项
    showHandle: {
      type: Boolean,
      default: false,
    },
    handleWidth: {
      type: [String, Number],
      default: '60',
    },
    //索引
    showIndex: {
      type: Boolean,
      default: false,
    },
    //高度
    height: {
      type: [String, Number],
      default: '408',
    },
    //分页
    showPagination: {
      type: Boolean,
      default: true,
    },
    //高亮当前行
    showRowHighlight: {
      type: Boolean,
      default: false,
    },
    //多选
    showSelection: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      tableLoading: false,
    }
  },
  created () {
    /*  this.tableLoading = true
      setTimeout(() => (this.tableLoading = false), 600) */
  },
  methods: {
    translateTitle,
    //current-change
    handleRowChange (val) {
      this.showRowHighlight && this.$emit('rowChange', val)
    },
    //多选
    handleSelectionChange (val) {
      this.$emit('selectionChange', val)
    },
    //分页
    handleSizeChange (val) {
      // this.tableLoading = true
      this.$emit('sizeChange', val)
    },
    handleCurrentChange (val) {
      // this.tableLoading = true
      this.$emit('pageChange', val)
    },
    //关闭loading
    closeLoading () {
      this.tableLoading = false
    },
    //table layout
    doLayout () {
      setTimeout(() => this.$refs.myTable.doLayout(), 60)
    },
  },
}
</script>

<style lang="scss" scoped>
  .zTable {
    width: 100%;
    /* ::v-deep .el-table {
        &:before,
        .el-table__fixed-right::before,
        .el-table__fixed::before {
          opacity: 0;
        }
      } */
    ::v-deep(.el-table__body-wrapper,.el-table__fixed-body-wrapper) {
      overflow: auto !important;
    }

    ::v-deep(.cell) {
      overflow: hidden !important;
    }

    ::v-deep(.el-pagination) {
      button:hover {
        color: #409eff;
      }

      .btn-prev {
        background: none;
        color: #b6c1cd;

        .el-icon {
          font-size: 14px;
        }

        .el-icon-arrow-left:before {
          content: '\e792';
        }
      }

      .btn-next {
        background: none;
        color: #b6c1cd;

        .el-icon {
          font-size: 14px;
        }

        .el-icon-arrow-right:before {
          content: '\e791';
        }
      }

      .el-pagination__jump {
        float: right;
        margin-left: 0;
      }

      .el-pager {
        color: #b6c1cd;

        li {
          border-radius: 100%;
          padding: 0;
          min-width: 28px;
          box-sizing: border-box;
          margin: 0 3px;
        }

        li.active {
          // border: 1px solid #a8b5c3;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

  .el-table {
  }
</style>
