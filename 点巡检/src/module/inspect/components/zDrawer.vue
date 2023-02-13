<template>
  <el-drawer
    ref="drawer"
    :before-close="handleClose"
    :visible.sync="visible"
    direction="rtl"
    :size="310"
    custom-class="s-drawer"
  >
    <div slot="title" class="d-title">
      {{ translateTitle('筛选条件') }}
      <span class="line" />
    </div>
    <div class="s-drawer__content">
      <slot />
      <div class="s-drawer__footer">
        <el-button type="primary" class="conBtn" @click="doSearch">
          {{ translateTitle('查询') }}
        </el-button>
        <el-button type="primary" class="conResetBtn" @click="doRest">
          {{ translateTitle('重置') }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { translateTitle } from '../i18n'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  methods: {
    translateTitle,
    handleClose() {
      this.$emit('closeDrawer')
    },
    doSearch() {
      this.$emit('doSearch')
    },
    doRest() {
      this.$emit('doRest')
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep(.s-drawer) {
  background: #101011;
  .el-drawer__header {
    padding: 40px 30px 20px;
    color: #fff;
    margin-bottom: 10px;
    .d-title {
      position: relative;
      .line {
        position: absolute;
        height: 1px;
        width: 244px;
        background: rgba(255, 255, 255, 0.1);
        bottom: -25px;
        left: 0;
      }
      &:after {
        content: '';
        position: absolute;
        height: 2px;
        width: 30px;
        left: 0;
        bottom: -25px;
        background: #307ec7;
      }
    }
  }
  .el-drawer__body {
    padding: 30px;
    overflow: auto;
    .el-form {
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 35px;
    }
    .el-form-item__label {
      color: #fff;
    }
    .el-input::-webkit-input-placeholder {
      color: #777;
    }
    .el-input--small .el-input__inner {
      height: 28px;
      line-height: 28px;
      background-color: #1d1f21;
      border-color: #25282b;
      box-shadow: none;
    }
    .el-select {
      width: 100%;
    }
    .s-drawer__footer {
      text-align: center;
      .conBtn {
        width: 230px;
        height: 36px;
        background: #307ec7;
        border-color: #307ec7;
        font-size: 14px;
      }
      .conResetBtn {
        width: 230px;
        height: 36px;
        background: #30c782;
        border-color: #307ec7;
        font-size: 14px;
        margin-top: 2em;
        margin-left: -1px;
      }
    }
  }
}
</style>
