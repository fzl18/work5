<template>
  <!-- 云布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabsBar,
    }"
    class="layout-container-cloud"
    :style="isQianKun ? { 'padding-top': '0px' } : {}"
  >
    <div
      v-if="device === 'mobile' && !collapse"
      class="mask"
      @click="handleFoldSideBar"
    ></div>
    <min-side-bar v-if="!isQianKun"></min-side-bar>
    <div
      :class="collapse ? 'is-collapse-main' : ''"
      class="core-main"
      :style="isQianKun ? { 'margin-left': '0px' } : {}"
    >
      <div :class="fixedHeader ? 'fixed-header' : ''" class="layout-header">
        <min-nav-bar v-if="!isQianKun"></min-nav-bar>
      </div>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'Cloud',
    props: {
      collapse: {
        type: Boolean,
        default() {
          return false
        },
      },
      fixedHeader: {
        type: Boolean,
        default() {
          return true
        },
      },
      showTabsBar: {
        type: Boolean,
        default() {
          return true
        },
      },
      device: {
        type: String,
        default() {
          return 'desktop'
        },
      },
    },
    data() {
      return {
        isQianKun: window.__POWERED_BY_QIANKUN__,
      }
    },
    mounted() {
      this.getMenu()
    },
    methods: {
      getMenu() {
        this.$store.commit('coreRoutes/setRoutes', [{}])
        this.$api
          .getMenu({
            params: {
              topUnit: this.$store.state.coreCommon.userinfo.topUnit,
              userCode: this.$store.state.coreCommon.userinfo.userCode,
            },
          })
          .then(async (res) => {
            if (res.code == 0) {
              let userPower = []
              let allMenu = []
              await this.$api
                .getDictionary({
                  params: {
                    catalogCode: process.env.VUE_APP_CATALOGCODE || '',
                  },
                })
                .then((res) => {
                  if (res.data && res.data.length) {
                    res.data.forEach((item) => {
                      userPower.push(item.dataCode)
                    })
                  }
                })
              ;(await res.data.length) &&
                res.data.forEach((item) => {
                  userPower.forEach((it) => {
                    if (
                      item.optId === it &&
                      item.children &&
                      item.children.length
                    ) {
                      item.children.forEach((it) => {
                        allMenu.push(it)
                      })
                    }
                  })
                })
              const arr = this.hasChildren(allMenu)
              const childArr = arr[0].children
              childArr.unshift({
                fullPath: '/home/index',
                icon: '',
                meta: {
                  imgUrl: '',
                  title: '首页',
                },
                path: '/home',
              })
              this.$store.commit('coreRoutes/setRoutes', childArr)
            } else {
              const arr = [{}]
              this.$store.commit('coreRoutes/setRoutes', childArr)
            }
          })
      },
      hasChildren(val) {
        val.forEach((item) => {
          item.meta = {}
          item.meta.title = item.localOptName ? item.localOptName : ''
          item.meta.remixIcon = item.icon ? item.icon : ''
          item.path = item.optRoute ? item.optRoute : ''
          item.fullPath = item.optRoute ? item.optRoute : ''
          if (item.icon) {
            item.meta.imgUrl = item.icon
          }
          if (item.children) {
            this.hasChildren(item.children)
          }
        })
        return val
      },
      ...mapActions({
        handleFoldSideBar: 'coreSettings/foldSideBar',
      }),
      haschild(val) {
        val.map((item) => {
          if (item.children && item.children.length === 0) {
            delete item.children
          } else {
            this.haschild(item.children)
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .layout-header {
    box-shadow: $base-box-shadow;
  }

  .layout-container-cloud {
    position: relative;

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index - 1;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      opacity: 0.7;
      backdrop-filter: brightness(60%) saturate(250%) blur(10px);
    }

    // &.fixed {
    //   padding-top: calc(
    //     #{$base-nav-bar-height-small} + #{$base-tabs-bar-height}
    //   );
    // }

    &.fixed,
    &.fixed.no-tabs-bar {
      padding-top: $base-nav-bar-height-small;
    }

    .core-main {
      position: relative;
      width: auto;
      min-height: 100%;
      margin-left: calc(#{$base-left-menu-width} - 66px);
      background: #f6f8f9;
      transition: $base-transition;

      ::v-deep() {
        .fixed-header {
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          z-index: $base-z-index - 2;
          // width: $base-right-content-width;
          overflow: hidden;
          transition: $base-transition;
        }

        .nav-bar-container {
          position: relative;
          box-sizing: border-box;
        }

        .tabs-bar-container {
          box-sizing: border-box;
        }

        .app-main-container {
          border-radius: $base-border-radius;
        }
      }

      &.is-collapse-main {
        margin-left: $base-left-menu-width-min-small;

        ::v-deep() {
          .fixed-header {
            left: 0; //$base-left-menu-width-min-small;
            width: 100%; //calc(100% - #{$base-left-menu-width-min-small});
          }
        }
      }
    }
  }
</style>
