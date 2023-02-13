<template>
  <div :class="['bt-dropdown__container', splitBtn, arrowBtn]">
    <el-dropdown
      ref="dropdown"
      split-button
      size="mini"
      type="primary"
      trigger="click"
      @click="handleClick"
    >
      <div v-clickoutside="hide" @click="clickDown">
        <slot></slot>
      </div>
    </el-dropdown>
  </div>
</template>
<script>
  import Clickoutside from 'element-ui/src/utils/clickoutside'
  export default {
    name: 'BtDropdown',
    directives: { Clickoutside },
    props: {
      showSplit: {
        type: Boolean,
        default: true,
      },
      showArrow: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      splitBtn() {
        return this.showSplit ? '' : 'bt-dropdown-btn-no'
      },
      arrowBtn() {
        return this.showArrow ? '' : 'bt-dropdown-arrow-no'
      },
    },
    methods: {
      handleClick() {
        this.$emit('splitClick')
      },
      clickDown() {
        this.$refs.dropdown.broadcast('ElDropdownMenu', 'visible', true)
      },
      hide() {
        this.$refs.dropdown.broadcast('ElDropdownMenu', 'visible', false)
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
  .bt-dropdown-arrow-no {
    .el-button--primary {
      border-bottom-right-radius: 4px !important;
      border-top-right-radius: 4px !important;
      border-right-color: $base-color-blue !important;
    }
    .el-dropdown__caret-button {
      display: none;
    }
  }
  .el-dropdown-menu--mini .el-dropdown-menu__item {
    padding: 0 15px;
    margin: 5px 0;
  }
</style>
