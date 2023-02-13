<template>
  <el-dropdown
    class="s-dropdown"
    trigger="click"
    split-button
    size="mini"
    type="primary"
    @command="handleCommand"
    @click="handleClick"
  >
    <i class="el-icon-plus s-title-icon" />
    {{ translateTitle('新建') }}
    <el-dropdown-menu slot="dropdown" class="s-dropdown-menu">
      <el-dropdown-item
        v-for="(item, index) in dropData"
        :key="index"
        :command="item.command"
        :disabled="item.disabled"
      >
        <i :class="item.iconClass" />
        {{ translateTitle(item.value) }}
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { translateTitle } from '../i18n'
export default {
  props: {
    dropData: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {}
  },
  methods: {
    handleCommand(command) {
      this.$emit('handleDropClick', command)
    },
    translateTitle,
    handleClick() {
      this.$emit('handleClick')
    },
  },
}
</script>

<style lang="scss" scoped>
.s-dropdown {
  margin-left: 24px !important;
  .el-button-group .el-button--primary {
    border-radius: 4px;
  }
  ::v-deep(.el-button-group .el-button--primary:first-child) {
    color: #307ec7;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border: 1px solid #307ec7 !important;
    box-sizing: border-box;
    background: #fff;
  }
  .el-button-group .el-button--primary:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
  ::v-deep(.el-dropdown__caret-button::before) {
    display: none;
  }
  .el-icon-arrow-down:before {
    content: '\e790';
  }
}
</style>
<style lang="scss">
.s-dropdown-menu {
  .el-dropdown-menu__item {
    color: #606266;
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    color: #307ec7;
  }
}
</style>
