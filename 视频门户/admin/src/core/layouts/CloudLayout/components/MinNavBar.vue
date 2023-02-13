<template>
  <div class="nav-bar-container" :class="layout">
    <el-row :gutter="15" type="flex" justify="center" align="center">
      <el-col
        :lg="12"
        :md="12"
        :sm="12"
        :xl="12"
        :xs="4"
        style="display: flex; align-items: center"
      >
        <img src="@/assets/images/logo.png" class="logo" alt="" />
        <!-- <span style="font-size: 20px; color: #fff; margin-top: 5px">
          CI持续改善系统
        </span> -->
        <!-- <logo></logo> -->
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="20">
        <div class="right-panel">
          <theme class="hidden-xs-only"></theme>
          <!-- <company></company> -->
          <!-- <remix-icon
            v-if="true"
            slot="reference"
            icon-class="settings-3-line"
            style="font-size: 22px"
            @click="linkto"
          ></remix-icon> -->
          <!-- <notice /> -->
          <avatar></avatar>
          <full-screen></full-screen>
          <language></language>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapGetters } from 'vuex'
  import { handleFirstMenu } from '@/utils/routes'
  import { openFirstMenu } from '@/config'
  import cookie from 'js-cookie'

  export default {
    name: 'MinNavBar',
    props: {
      layout: {
        type: String,
        default: 'cloud',
      },
    },
    data() {
      return {
        firstMenu: '',
      }
    },
    computed: {
      ...mapGetters({
        routes: 'coreRoutes/routes',
      }),
      handleRoutes() {
        return this.routes.filter((item) => item.hidden !== true && item.meta)
      },
    },
    watch: {
      $route: {
        handler() {
          const firstMenu = handleFirstMenu()
          if (this.firstMenu !== firstMenu) {
            this.firstMenu = firstMenu
            this.handleTabClick({ name: firstMenu }, true)
          }
        },
        immediate: true,
      },
    },
    mounted() {
      // console.log(this.$store.state.coreUser)
    },
    methods: {
      translateTitle,
      handleTabClick(tab, mounted) {
        const filter = this.routes.find((item) => item.path === tab.name)
        const childrenArr = filter && filter.children ? filter.children : []
        this.$store.dispatch('coreRoutes/setPartialRoutes', childrenArr)
        if (mounted !== true && openFirstMenu) {
          this.$router.push(childrenArr[0].fullPath)
        }
        //this.$store.dispatch("settings/openSideBar");
      },
      async linkto() {
        // await this.$store.dispatch('coreUser/resetAll')
        // cookie.remove('JSESSIONID')
        // cookie.remove('PHPSESSID')
        window.location.href = '/sysauth/dictionary/index'
        // window.open('/sysauth/dictionary/index')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .nav-bar-container {
    position: relative;
    height: $base-nav-bar-height-small;
    padding-right: $base-padding;
    padding-left: $base-padding;
    overflow: hidden;
    user-select: none;
    background: $base-color-white;
    box-shadow: $base-box-shadow;

    .logo-container-cloud,
    .left-panel {
      display: flex;
      align-items: center;
      justify-items: center;
      height: $base-nav-bar-height-small;

      ::v-deep {
        .breadcrumb-container {
          margin-left: $base-padding;
        }

        .el-tabs {
          margin-left: $base-padding;

          .el-tabs__header {
            margin: 0;
          }

          .el-tabs__item {
            > div {
              display: flex;
              align-items: center;

              i {
                margin-right: 3px;
              }
            }
          }
        }

        .el-tabs__nav-wrap::after {
          display: none;
        }
      }
    }

    .right-panel {
      display: flex;
      align-content: center;
      align-items: center;
      justify-content: flex-end;
      height: $base-nav-bar-height-small;

      ::v-deep {
        [class*='ri-'] {
          margin-left: $base-padding;
          color: $base-color-white;
          cursor: pointer;
        }

        button {
          [class*='ri-'] {
            margin-left: 0;
            color: $base-color-white;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .el-dropdown-menu__item {
    display: flex;
    align-content: center;
    align-items: center;

    svg {
      margin-right: 3px;
    }
  }
  .logo {
    // margin-top: 7px;
    // transform: scale(0.82);
    width: 214px;
    margin-left: 8px;
  }
</style>
