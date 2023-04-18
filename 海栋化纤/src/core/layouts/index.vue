<template>
  <div :class="classObj" class="vue-admin">
    <component
      :is="layout"
      :collapse="collapse"
      :fixed-header="fixedHeader"
      :show-tabs-bar="showTabsBar"
      :device="device"
    ></component>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { tokenName } from '@/config'

  export default {
    name: 'Layout',
    data() {
      return {
        oldLayout: '',
        width: 0,
      }
    },
    computed: {
      ...mapGetters({
        layout: 'settings/layout',
        showTabsBar: 'settings/showTabsBar',
        collapse: 'settings/collapse',
        fixedHeader: 'settings/fixedHeader',
        device: 'settings/device',
      }),
      classObj() {
        return {
          mobile: this.device === 'mobile',
        }
      },
    },
    beforeMount() {
      window.addEventListener('resize', this.handleLayouts)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleLayouts)
    },
    mounted() {
      this.oldLayout = this.layout
      this.handleLayouts()

      this.$nextTick(() => {
        window.addEventListener(
          'storage',
          (e) => {
            if (e.key === tokenName && (e.key === null || e.value === null))
              window.location.reload()
          },
          false
        )
      })
    },
    methods: {
      ...mapActions({
        handleChangeLayout: 'settings/changeLayout',
        handleToggleDevice: 'settings/toggleDevice',
      }),
      handleLayouts() {
        const width = document.body.getBoundingClientRect().width
        if (this.width !== width) {
          const isMobile = width - 1 < 992
          this.handleChangeLayout(isMobile ? 'vertical' : this.oldLayout)
          this.handleToggleDevice(isMobile ? 'mobile' : 'desktop')
          this.width = width
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vue-admin {
    position: relative;
    width: 100%;
    height: 100%;

    /* 手机端开始 */
    &.mobile {
      ::v-deep {
        .el-pager,
        .el-pagination__jump {
          display: none;
        }
        .layout-container-vertical {
          .el-scrollbar.side-bar-container.is-collapse {
            width: 0;
          }
          .core-main {
            width: 100%;
            margin-left: 0;
          }
        }
        .core-main {
          .fixed-header {
            left: 0 !important;
            width: 100% !important;
          }
        }
      }
    }
    /* 手机端结束 */
  }
</style>
