<template>
  <div class="bt-title__container">
    <div class="title-head">
      <div :class="['title', titleClass]">{{ title }}</div>
      <div class="title-head_right">
        <div
          v-if="showDrawer"
          class="icon-sm search-btn"
          @click="handleOpenDrawer"
        >
          <remix-icon
            icon-class="bt-filter"
            class="remix-icon"
            is-svg
          ></remix-icon>
        </div>
        <slot></slot>
      </div>
    </div>
    <div v-if="showLine" class="line"></div>
    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      :modal="false"
      custom-class="bt-drawer"
      :title="drawerTitle"
    >
      <div class="drawer-main">
        <slot name="drawer"></slot>
      </div>
      <!-- <button
        class="drawer_close_btn ri-indent-increase"
        @click="closeDrawer"
      ></button> -->
    </el-drawer>
  </div>
</template>
<script>
  let sizeTypes = {
    large: 'large',
    small: 'small',
    mini: 'mini',
  }
  export default {
    name: 'BtTitle',
    props: {
      title: {
        type: String,
        default: '',
      },

      showLine: {
        type: Boolean,
        default: true,
      },

      size: {
        type: String,
        default: 'small',
      },

      //是否显示展开抽屉按钮
      showDrawer: {
        type: Boolean,
        default: false,
      },

      //抽屉标题
      drawerTitle: {
        type: String,
        default: '筛选条件',
      },
    },
    data() {
      return {
        drawerVisible: false,
      }
    },
    computed: {
      titleClass() {
        let { size } = this
        return size && sizeTypes[size] ? sizeTypes[size] : ''
      },
    },
    methods: {
      handleOpenDrawer() {
        this.drawerVisible = true
      },
      closeDrawer() {
        this.drawerVisible = false
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-title__container {
    .title-head {
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      .large {
        font-size: 18px;
        line-height: 26px;
      }
      .small {
        font-size: 14px;
        line-height: 22px;
      }
      .mini {
        font-size: 12px;
        line-height: 20px;
      }
    }

    .line {
      width: 100%;
      height: 1px;
      background-color: #e5e5e5;
      position: relative;
      margin-bottom: 20px;
      &::before {
        content: '';
        width: 33px;
        height: 2px;
        background-color: #307fc7;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
    .title-head_right {
      display: flex;
      display: -webkit-flex;
      & > * {
        margin: 0 8px;
      }
      .search-btn {
        cursor: pointer;
        font-size: 16px;
      }
    }
    .icon-sm {
      width: 28px;
      height: 28px;
      background-color: $base-color-blue;
      color: #fff;
      font-size: 20px;
      border-radius: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 20px;
      }
    }
    .bt-drawer {
      position: relative;
      .drawer-main {
        padding: 28px;
      }
      .drawer_close_btn {
        position: fixed;
        width: 35px;
        height: 35px;
        background-color: $base-color-blue;
        font-size: 28px;
        color: #fff;
        border: none;
        display: flex;
        justify-content: center;
        border-radius: 5px;
        top: 100px;
        right: 280px;
        z-index: 9999;
        cursor: pointer;
      }
    }
  }
</style>
<style lang="scss">
  .title-head_right {
    .el-input-group__append,
    .el-input-group__prepend {
      background-color: $base-color-blue;
      padding: 0 12px;
      color: #fff;
      font-size: 14px;
    }
  }
  .bt-title__container {
    .bt-drawer {
      width: 296px !important;
      background-color: #101011;
      color: #ffffff;
      box-shadow: -5px 1px 21px 3px rgba(147, 147, 147, 0.26);
      border-radius: 5px;
      .el-dialog__close {
        color: #ffffff;
      }
      .el-drawer__header {
        position: relative;
        color: #fff;
        padding: 28px;
        margin-bottom: 0;
        &::before {
          content: '';
          width: 25px;
          height: 2px;
          background-color: $base-color-blue;
          position: absolute;
          bottom: -0px;
          left: 28px;
          z-index: 10;
        }
        &::after {
          content: '';
          width: calc(100% - 56px);
          height: 1px;
          background-color: #313131;
          position: absolute;
          bottom: -0px;
          left: 28px;
          z-index: 9;
        }
      }
    }
    .drawer-main {
      .el-form {
        .el-form-item__label {
          color: #fff;
          font-size: 12px;
        }
        .el-select,
        .el-input {
          width: 100%;
        }
        .el-input__inner {
          background-color: #1d1f21;
          border-color: #2a2e31;
          color: #777777;
          border-radius: 5px;
        }
        .bt-search_btn {
          width: 100%;
          margin: 40px 0;
          position: relative;
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: -30px;
            width: 100%;
            height: 1px;
            background-color: #313131;
          }
        }
      }
    }
  }
</style>
