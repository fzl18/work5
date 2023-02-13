<template>
  <div class="bt-page__container btplus">
    <!-- 第一部分 -->

    <div class="bt-page__head">
      <div class="bt-column__header">
        <div class="header maxinumHeader">
          <div>
            <div class="icon-sm" :style="`background-color:${iconBgColor}`">
              <remix-icon
                v-if="titleIcon"
                :icon-class="titleIcon"
                class="remix-icon"
              />
            </div>
            <div class="title">{{ title }}</div>
          </div>
          <div class="bt-column__option">
            <div
              v-if="showDrawer"
              class="icon-sm search-btn"
              @click="handleOpenDrawer"
            >
              <remix-icon
                icon-class="bt-filter"
                class="remix-icon"
                is-svg
              />
            </div>
            <slot name="option" />
          </div>
        </div>
        <div v-if="$slots.head" class="line" />
      </div>
      <div class="bt-column__body"><slot name="head" /></div>
    </div>
    <!-- 第二部分 -->
    <slot />

    <!-- 抽屉 -->

    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      :modal="false"
      custom-class="bt-drawer"
      :title="drawerTitle"
    >
      <div class="drawer-main">
        <slot name="drawer" />
      </div>
      <button
        class="drawer_close_btn ri-indent-increase"
        @click="closeDrawer"
      />
    </el-drawer>
  </div>
</template>
<script>
  export default {
    name: 'BtPagePlus',
    props: {
      // 标题
      title: {
        type: String,
        default: '标题',
      },
      //icon
      titleIcon: {
        type: String,
        default: 'edit-2-fill',
      },

      iconBgColor: {
        type: String,
        default: '#307ec7',
      },

      //内标
      subtitle: {
        type: String,
        default: '',
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
    computed: {},
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
<style lang="scss">
  //   .bt-page__container.btplus {
  //     width: 100%;
  //     .maxinumHeader {
  //       display: flex;
  //       .bt-column__option {
  //         flex: 1;
  //         display: flex;
  //         justify-content: flex-end;
  //       }
  //     }
  //     .bt-page__head {
  //       background-color: #fff;
  //       padding: 15px;
  //       margin-bottom: 12px;
  //     }
  //     .bt-page__body {
  //       background-color: #fff;
  //       padding: 15px;
  //       margin: 0 0;
  //     }
  //     .bt-column__header {
  //       .header {
  //         display: flex;
  //         // justify-content: space-between;
  //         height: 100%;
  //         & > div {
  //           display: flex;
  //         }
  //         .title {
  //           font-size: 18px;
  //           line-height: 28px;
  //           margin: 0 10px;
  //           position: relative;

  //           // padding-bottom: 20px;
  //           cursor: pointer;
  //           // &::before {
  //           //   content: '';
  //           //   width: 100%;
  //           //   height: 2px;
  //           //   background-color: #307fc7;
  //           //   position: absolute;
  //           //   left: 0;
  //           //   bottom: 0;
  //           // }
  //         }
  //         .subtitle {
  //           padding-bottom: 20px;
  //           position: relative;
  //           margin-right: 36px;
  //           cursor: pointer;
  //           font-size: 14px;
  //           line-height: 22px;
  //           &.active {
  //             &::before {
  //               content: '';
  //               width: 100%;
  //               height: 2px;
  //               background-color: #307fc7;
  //               position: absolute;
  //               left: 0;
  //               bottom: -1px;
  //               z-index: 1000;
  //             }
  //           }
  //         }
  //       }
  //       .line {
  //         width: 100%;
  //         height: 1px;
  //         margin-bottom: 20px;
  //         background-color: #e5e5e5;
  //         // margin: 20px 0;
  //         position: relative;
  //         // &::before {
  //         //   content: '';
  //         //   width: 33px;
  //         //   height: 2px;
  //         //   background-color: #307fc7;
  //         //   position: absolute;
  //         //   left: 0;
  //         //   bottom: 0;
  //         // }
  //       }
  //       .bt-column__option {
  //         & > * {
  //           margin: 0 18px;
  //         }
  //         .search-btn {
  //           cursor: pointer;
  //           font-size: 16px;
  //         }
  //       }
  //     }
  //     .icon-sm {
  //       width: 28px;
  //       height: 28px;
  //       background-color: $base-color-blue;
  //       color: #fff;
  //       font-size: 20px;
  //       border-radius: 5px;
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       i {
  //         font-size: 20px;
  //       }
  //     }
  //     .bt-drawer {
  //       position: relative;
  //       .drawer-main {
  //         padding: 28px;
  //       }
  //       .drawer_close_btn {
  //         position: fixed;
  //         width: 35px;
  //         height: 35px;
  //         background-color: $base-color-blue;
  //         font-size: 28px;
  //         color: #fff;
  //         border: none;
  //         display: flex;
  //         justify-content: center;
  //         border-radius: 5px;
  //         top: 100px;
  //         right: 280px;
  //         z-index: 9999;
  //         cursor: pointer;
  //       }
  //     }
  //   }
  //
</style>
//
<style lang="scss">
  //   .bt-page__container {
  //     .bt-drawer {
  //       width: 296px !important;
  //       background-color: #101011;
  //       color: #ffffff;
  //       box-shadow: -5px 1px 21px 3px rgba(147, 147, 147, 0.26);
  //       border-radius: 5px;
  //       .el-dialog__close {
  //         color: #ffffff;
  //       }
  //       .el-drawer__header {
  //         position: relative;
  //         color: #fff;
  //         padding: 28px;
  //         margin-bottom: 0;
  //         &::before {
  //           content: '';
  //           width: 25px;
  //           height: 2px;
  //           background-color: $base-color-blue;
  //           position: absolute;
  //           bottom: -0px;
  //           left: 28px;
  //           z-index: 10;
  //         }
  //         &::after {
  //           content: '';
  //           width: calc(100% - 56px);
  //           height: 1px;
  //           background-color: #313131;
  //           position: absolute;
  //           bottom: -0px;
  //           left: 28px;
  //           z-index: 9;
  //         }
  //       }
  //     }
  //     .drawer-main {
  //       .el-form {
  //         .el-form-item__label {
  //           color: #fff;
  //           font-size: 12px;
  //         }
  //         .el-select,
  //         .el-input {
  //           width: 100%;
  //         }
  //         .el-input__inner {
  //           background-color: #1d1f21;
  //           border-color: #2a2e31;
  //           color: #777777;
  //           border-radius: 5px;
  //         }
  //         .bt-search_btn {
  //           width: 100%;
  //           margin: 40px 0;
  //           position: relative;
  //           &::before {
  //             content: '';
  //             position: absolute;
  //             left: 0;
  //             top: -30px;
  //             width: 100%;
  //             height: 1px;
  //             background-color: #313131;
  //           }
  //         }
  //       }
  //     }
  //   }
</style>
