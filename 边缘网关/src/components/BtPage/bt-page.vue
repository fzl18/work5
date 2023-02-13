<template>
  <div :class="['bt-page__container', affixClass]">
    <main>
      <!-- 第一部分 -->
      <div class="bt-page__head">
        <div class="bt-column__header">
          <div class="header">
            <div class="left">
              <div class="position">
                <span>
                  <remix-icon icon-class="home-2-line"></remix-icon>
                  {{ $translateTitle('当前位置') }}：
                </span>
                <bt-breadcrumb></bt-breadcrumb>
              </div>
              <div class="tit">
                <div class="icon-sm" :style="`background-color:${iconBgColor}`">
                  <remix-icon
                    v-if="titleIcon"
                    :icon-class="titleIcon"
                    class="remix-icon"
                  ></remix-icon>
                </div>
                <div class="title">{{ title }}</div>
              </div>
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
                ></remix-icon>
              </div>
              <slot name="option"></slot>
            </div>
          </div>
          <div v-if="$slots.head" class="line"></div>
        </div>
        <div class="bt-column__body"><slot name="head"></slot></div>
      </div>
      <!-- 第二部分 -->
      <div
        v-if="$slots.default"
        class="bt-page__body"
        :class="{ clean: clean }"
      >
        <div class="bt-column__header">
          <div class="header">
            <div class="subtitle">{{ subtitle }}</div>
          </div>
          <div v-if="subtitle" class="line"></div>
        </div>
        <div class="bt-column__body"><slot></slot></div>
      </div>
      <!-- 多个section -->
      <div class="bt-page__sections">
        <slot name="sections"></slot>
      </div>
    </main>

    <!-- 锚点导航 -->
    <div v-if="anchors.length > 0" class="affix">
      <a-anchor
        ref="anchor"
        show-ink-in-fixed
        :target-offset="50"
        :affix="false"
        wrapper-class="bt-anchor"
        @click="handleAnchorClick"
      >
        <a-anchor-link
          v-for="item in anchors"
          :key="item.href"
          :href="item.href"
          :title="item.title"
        ></a-anchor-link>
      </a-anchor>
    </div>

    <!-- 抽屉 -->
    <el-drawer
      :visible.sync="drawerVisible"
      direction="rtl"
      :modal="false"
      custom-class="bt-drawer"
      :title="$t(drawerTitle)"
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
  export default {
    name: 'BtPage',
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

      //内标题
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

      //锚点导航
      anchors: {
        type: Array,
        default() {
          return []
        },
      },
      //清除body多余样式
      clean: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        drawerVisible: false,
      }
    },
    computed: {
      affixClass() {
        return this.anchors.length > 0 ? 'bt-affix' : ''
      },
    },
    mounted() {
      if (this.anchors.length > 0) {
        let dom = document.getElementsByClassName('ant-anchor-ink')[0]
        this.anchors.forEach((item, index) => {
          let top = 10.5 + index * 30
          let div = document.createElement('span')
          div.setAttribute('class', 'bt-anchor-ink-ball visible')
          div.setAttribute('style', `top: ${top}px;`)
          dom.appendChild(div)
        })
      }
    },
    methods: {
      handleOpenDrawer() {
        this.drawerVisible = true
      },
      closeDrawer() {
        this.drawerVisible = false
      },
      handleAnchorClick(e, link) {
        // 阻止点击的默认事件修改路由
        e.preventDefault()
        var srcolls = document.getElementById(link.href)
        if (srcolls) {
          srcolls.scrollIntoView({ block: 'start', behavior: 'smooth' })
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-page__container {
    width: 100%;
    .bt-page__head {
      background-color: #fff;
      padding: 15px;
      padding-top: 5px;
    }
    .bt-page__body {
      background-color: #fff;
      padding: 15px;
      box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.1);
      margin: 15px 0;
      &.clean {
        padding: 0;
      }
    }
    .bt-page__sections {
    }
    ::v-deep .bt-column__header {
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div {
          display: flex;
        }
        .left {
          flex-direction: column;
          .position {
            flex-direction: row;
            display: flex;
            align-items: center;
            line-height: 36px !important;
            height: 36px !important;
            color: #999;
            margin-bottom: 10px;
            ::v-deep {
              .el-breadcrumb__inner {
                color: #999;
              }
            }
          }
          .tit {
            flex-direction: row;
            display: flex;
            align-items: center;
          }
        }
        .title {
          font-size: 18px;
          line-height: 28px;
          margin: 0 10px;
        }
        .subtitle {
          font-size: 14px;
          line-height: 22px;
        }
      }
      .line {
        width: 100%;
        height: 1px;
        background-color: #e5e5e5;
        margin: 20px 0;
        position: relative;
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
      .bt-column__option {
        & > * {
          margin: 0 18px;
          margin-top: 40px;
        }
        .search-btn {
          cursor: pointer;
          font-size: 16px;
        }
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
  .bt-affix {
    display: flex;
    & > main {
      flex: 1;
    }
    .affix {
      width: 200px;
      background-color: #fff;
      padding: 15px;
      margin-bottom: 15px;
      position: relative;
      .bt-anchor {
        width: 150px;
        top: 100px;
        right: 20px;
        position: fixed;
      }
    }
  }
</style>
<style lang="scss">
  .bt-page__container {
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
          .el-button {
            width: 47%;
          }
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
        ::-webkit-input-placeholder {
          /* WebKit browsers */
          color: #777777;
        }
        :-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: rgb(100, 193, 173);
        }
        ::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: rgb(100, 193, 173);
        }
        :-ms-input-placeholder {
          /* Internet Explorer 10+ */
          color: rgb(100, 193, 173);
        }
      }
    }
    //锚点样式
    .ant-anchor {
      .bt-anchor-ink-ball {
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background-color: #bfbfbf;
        border-color: #bfbfbf;
        position: absolute;
        left: 50%;
        border: 2px solid #fff;
        // box-sizing: border-box;
        transform: translateX(-50%);
      }
      .ant-anchor-ink {
        left: 2px;
        .ant-anchor-ink-ball {
          width: 10px;
          height: 10px;
          border-radius: 10px;
          background-color: $base-color-blue;
          border-color: $base-color-blue;
          z-index: 99;
        }
        &::before {
          height: calc(100% - 20px);
          margin: 10px auto;
          width: 1px;
        }
      }
      .ant-anchor-link {
        .ant-anchor-link-title {
          color: #bfbfbf;
        }
      }
      .ant-anchor-link-active > .ant-anchor-link-title {
        color: $base-color-blue;
      }
    }
  }
</style>
