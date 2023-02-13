<template>
  <div class="bt-pagination__container">
    <el-pagination
      background
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :page-count="pageCount"
      :pager-count="pagerCount"
      :current-page.sync="currentPage"
      :layout="layout"
      :popper-class="popperClass"
      :disabled="disabled"
      hide-on-single-page
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'BtPagination',

    props: {
      //el-pagination参数
      total: {
        type: Number,
        default: null,
      },

      pageCount: {
        type: Number,
        default: null,
      },

      pagerCount: {
        type: Number,
        default: 7,
      },

      page: {
        type: Number,
        default: 1,
      },

      limit: {
        type: Number,
        default: 10,
      },

      pageSizes: {
        type: Array,
        default() {
          return [10, 20, 50, 100]
        },
      },

      popperClass: {
        type: String,
        default: '',
      },

      disabled: {
        type: Boolean,
        default: false,
      },

      showPageSizes: {
        type: Boolean,
        default() {
          return false
        },
      },
    },

    data() {
      return {}
    },
    computed: {
      currentPage: {
        get() {
          return this.page
        },
        set(val) {
          this.$emit('update:page', val)
        },
      },
      pageSize: {
        get() {
          return this.limit
        },
        set(val) {
          this.$emit('update:limit', val)
        },
      },
      layout() {
        return this.showPageSizes
          ? 'total, prev, pager, next, sizes, jumper'
          : 'total, prev, pager, next, jumper'
      },
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('pageSizeChange', { page: this.currentPage, limit: val })
        if (this.autoScroll) {
          scrollTo(0, 800)
        }
      },
      handleCurrentChange(val) {
        this.$emit('pagination', { page: val, limit: this.pageSize })
        if (this.autoScroll) {
          scrollTo(0, 800)
        }
      },
    },
  }
</script>
<style lang="scss">
  .bt-pagination__container {
    .el-pagination span:not([class*='suffix']),
    .el-pagination button {
      height: 24px;
      line-height: 24px;
    }
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #fff;
      color: $base-color-blue;
      border-radius: 24px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 20%);
    }
    .el-pager li {
      height: 24px;
      line-height: 24px;
    }
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .el-pager li {
      min-width: 24px;
      background-color: #fff;
    }
    .btn-prev {
      margin-left: 0;
      margin-right: 5px;
      .el-icon-arrow-left:before {
        content: '\e792';
      }
    }
    .btn-next {
      margin-left: 5px;
      margin-right: 0;
      .el-icon-arrow-right:before {
        content: '\e791';
      }
    }
    .el-pagination__total {
      float: left;
    }
    .el-pagination__jump,
    .el-pagination__sizes {
      float: right;
      font-size: 13px !important;
      line-height: 20px !important;
      margin: 0 10px;
      .el-input__inner {
        height: 24px;
      }
    }
  }
</style>
