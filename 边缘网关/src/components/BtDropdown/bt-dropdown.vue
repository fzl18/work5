<template>
  <div :class="['bt-dropdown__container', splitBtn]">
    <el-dropdown
      split-button
      size="mini"
      type="primary"
      trigger="click"
      @click="handleClick"
    >
      <slot></slot>
    </el-dropdown>
  </div>
</template>
<script>
  export default {
    name: 'BtDropdown',
    props: {
      showSplit: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      splitBtn() {
        return this.showSplit ? '' : 'bt-dropdown-btn-no'
      },
    },
    methods: {
      handleClick() {
        this.$emit('splitClick')
      },
    },
  }
</script>
<style lang="scss">
  .bt-dropdown__container {
    .el-dropdown {
      .el-button-group .el-button--primary {
        border-radius: 4px;
      }
      .el-button-group .el-button--primary:first-child {
        background-color: #fff;
        color: $base-color-blue;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
      }
      .el-button-group .el-button--primary:last-child {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
      }
      .el-dropdown__caret-button::before {
        display: none;
      }
      .el-icon-arrow-down:before {
        content: '\e790';
      }
      // .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover {
      //     color: #307ec7;
      // }
    }
  }
  .bt-dropdown-btn-no {
    .el-dropdown {
      .el-button-group .el-button--primary {
        border-radius: 4px !important;
        padding: 2px 0;
      }
      .el-button-group .el-button--primary:first-child {
        display: none;
      }
      .el-dropdown__caret-button::before {
        display: none;
      }
    }
  }
  .el-dropdown-menu--mini .el-dropdown-menu__item {
    padding: 0 15px;
    margin: 5px 0;
  }
</style>
