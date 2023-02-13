<template>
  <!-- 云布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabsBar,
    }"
    class="layout-container-cloud"
  >
    <div
      v-if="device === 'mobile' && !collapse"
      class="mask"
      @click="handleFoldSideBar"
    ></div>
    <min-side-bar></min-side-bar>
    <div :class="collapse ? 'is-collapse-main' : ''" class="core-main">
      <div :class="fixedHeader ? 'fixed-header' : ''" class="layout-header">
        <min-nav-bar></min-nav-bar>
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
    methods: {
      ...mapActions({
        handleFoldSideBar: 'coreSettings/foldSideBar',
      }),
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

      ::v-deep {
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

        ::v-deep {
          .fixed-header {
            left: 0; //$base-left-menu-width-min-small;
            width: 100%; //calc(100% - #{$base-left-menu-width-min-small});
          }
        }
      }
    }
  }
</style>
