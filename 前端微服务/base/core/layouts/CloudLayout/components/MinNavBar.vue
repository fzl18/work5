<template>
  <div class="nav-bar-container" :class="layout">
    <el-row :gutter="15">
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="4">
        <div class="left-panel">
          <!-- <logo></logo> -->
          <img class="logo" src="../../../../assets/images/boton.png" />
          <remix-icon
            v-if="!collapse"
            icon-class="menu-fill"
            class="fold-unfold"
            @click="toggleCollapse"
          ></remix-icon>
        </div>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="20">
        <div class="right-panel">
          <theme class="hidden-xs-only"></theme>
          <company></company>
          <avatar></avatar>
          <!-- <full-screen></full-screen> -->
          <el-tooltip
            class="item"
            effect="dark"
            content="权限管理"
            placement="top"
          >
            <i
              class="ri-settings-2-fill"
              style="font-size: 18px"
              @click="openMange"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="待办事项"
            placement="top"
          >
            <i
              class="ri-notification-3-fill"
              style="font-size: 18px"
              @click="switchRoute"
            ></i>
          </el-tooltip>
          <!-- <i class="ri-notification-3-fill" style="font-size: 18px"></i> -->
          <language></language>
          <el-tooltip
            class="item"
            effect="dark"
            content="帮助手册"
            placement="top"
          >
            <i class="ri-question-fill" style="font-size: 18px"></i>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapGetters, mapActions } from 'vuex'
  import { handleFirstMenu } from '@/utils/routes'
  import { openFirstMenu } from '@/config'

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
        collapse: 'coreSettings/collapse',
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
    methods: {
      ...mapActions({
        toggleCollapse: 'coreSettings/toggleCollapse',
      }),
      translateTitle,
      openMange() {
        // console.log(document.cookie)
        // window.location.href = '/permission'
        window.open(process.env.VUE_APP_PERMISSION_PATH)
        // window.open('/framework')
        // if (process.env.NODE_ENV === 'zbdev') {
        //   window.open('/sitauth')
        // } else {
        //   window.open('/permission')
        // }
      },
      switchRoute() {
        this.$router.push('/agencySystem/backlogIndex')
      },
      handleTabClick(tab, mounted) {
        const children = this.routes.find((item) => item.path === tab.name)
        if (children) {
          const childrenArr = children.children
          this.$store.dispatch('coreRoutes/setPartialRoutes', childrenArr)
          if (mounted !== true && openFirstMenu) {
            this.$router.push(childrenArr[0].fullPath)
          }
        }

        //this.$store.dispatch("settings/openSideBar");
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
      .fold-unfold {
        color: #fff;
        cursor: pointer;
      }
      .logo {
        padding: 0 18px;
      }
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
<style lang="scss">
  .el-dropdown-menu__item {
    display: flex;
    align-content: center;
    align-items: center;

    svg {
      margin-right: 3px;
    }
  }
</style>
