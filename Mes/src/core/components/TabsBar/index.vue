<template>
  <div class="tabs-bar-container">
    <fold v-if="layout === 'common'"></fold>
    <el-tabs
      v-model="tabActive"
      class="tabs-content"
      type="card"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.fullPath"
        :closable="!isAffix(item)"
        :label="translateTitle(item.meta.title)"
        :name="item.fullPath"
      ></el-tab-pane>
    </el-tabs>

    <el-dropdown @command="handleCommand">
      <span class="more">
        {{ translateTitle('更多') }}
        <remix-icon icon-class="arrow-down-s-line"></remix-icon>
      </span>
      <el-dropdown-menu slot="dropdown" class="tabs-more">
        <!-- <el-dropdown-item command="closeOthersTabs">
          {{ translateTitle('关闭其他') }}
        </el-dropdown-item>
        <el-dropdown-item command="closeLeftTabs">
          {{ translateTitle('关闭左侧') }}
        </el-dropdown-item>
        <el-dropdown-item command="closeRightTabs">
          {{ translateTitle('关闭右侧') }}
        </el-dropdown-item> -->
        <el-dropdown-item command="closeAllTabs">
          {{ translateTitle('关闭全部') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'TabsBar',
    props: {
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        affixTabs: [],
        tabActive: '',
        created: false,
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'coreTabsBar/visitedRoutes',
        routes: 'coreRoutes/routes',
      }),
    },
    watch: {
      $route: {
        handler(route) {
          this.$nextTick(() => {
            this.addTabs(route)
          })
        },
        immediate: true,
      },
    },
    created() {
      this.initAffixTabs(this.routes)
    },
    methods: {
      translateTitle,
      ...mapActions({
        addVisitedRoute: 'coreTabsBar/addVisitedRoute',
        delVisitedRoute: 'coreTabsBar/delVisitedRoute',
        delOthersVisitedRoutes: 'coreTabsBar/delOthersVisitedRoutes',
        delLeftVisitedRoutes: 'coreTabsBar/delLeftVisitedRoutes',
        delRightVisitedRoutes: 'coreTabsBar/delRightVisitedRoutes',
        delAllVisitedRoutes: 'coreTabsBar/delAllVisitedRoutes',
      }),
      initAffixTabs(routes) {
        routes.forEach((route) => {
          if (route.meta && route.meta.affix) this.addTabs(route)
          if (route.children) this.initAffixTabs(route.children)
        })
      },
      async addTabs(tag) {
        if (tag.name && tag.meta && tag.meta.tagHidden !== true) {
          let matched = [tag.name]
          let path = tag.path
          if (tag.matched) {
            matched = tag.matched.map((item) => item.name)
            path = tag.matched[tag.matched.length - 1].path
          }
          await this.addVisitedRoute({
            path: path,
            fullPath: tag.path,
            params: tag.params,
            query: tag.query,
            name: tag.name,
            matched: matched,
            meta: { ...tag.meta },
          })
          //临时修复query有问号传参tab标签不选中，待测试
          this.tabActive = tag.path
        }
      },
      isActive(route) {
        return route.path === this.$route.path
      },
      isAffix(tag) {
        return tag.meta && tag.meta.affix
      },
      handleTabClick(tab) {
        const route = this.visitedRoutes[tab.index]
        if (this.$route.fullPath !== route.fullPath) this.$router.push(route)
      },
      async handleTabRemove(fullPath) {
        const view = this.visitedRoutes.find(
          (item) => fullPath === item.fullPath
        )
        await this.delVisitedRoute(view)
        if (this.isActive(view)) this.toLastTab()
      },
      handleCommand(command) {
        switch (command) {
          case 'closeOthersTabs':
            this.closeOthersTabs()
            break
          case 'closeLeftTabs':
            this.closeLeftTabs()
            break
          case 'closeRightTabs':
            this.closeRightTabs()
            break
          case 'closeAllTabs':
            this.closeAllTabs()
            break
        }
      },
      async closeSelectedTab(view) {
        await this.delVisitedRoute(view)
        if (this.isActive(view)) this.toLastTab()
      },
      async closeOthersTabs() {
        const view = this.toThisTab()
        await this.delOthersVisitedRoutes(view)
      },
      async closeLeftTabs() {
        const view = this.toThisTab()
        await this.delLeftVisitedRoutes(view)
      },
      async closeRightTabs() {
        const view = this.toThisTab()
        await this.delRightVisitedRoutes(view)
      },
      async closeAllTabs() {
        const view = this.toThisTab()
        await this.delAllVisitedRoutes()
        if (this.affixTabs.some((tag) => tag.path === view.path)) return
        this.toLastTab()
      },
      toLastTab() {
        const latestView = this.visitedRoutes.slice(-1)[0]
        if (latestView) this.$router.push(latestView)
        else this.$router.push('/')
      },
      toThisTab() {
        const view = this.visitedRoutes.find(
          (item) => item.fullPath === this.$route.fullPath
        )
        if (this.$route.path !== view.path) this.$router.push(view)
        return view
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tabs-bar-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    height: $base-tabs-bar-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    user-select: none;
    background: none;
    border-top: 1px solid #f6f6f6;
    margin-top: 10px;
    ::v-deep {
      .fold-unfold {
        margin-right: $base-padding;
      }
    }

    .tabs-content {
      width: calc(100% - 90px);
      height: $base-tag-item-height;

      ::v-deep {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $base-tag-item-height;
          line-height: $base-tag-item-height;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            box-sizing: border-box;
            height: $base-tag-item-height;
            margin-right: 5px;
            line-height: $base-tag-item-height;
            border: 1px solid $base-border-color;
            border-radius: $base-border-radius;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
            background: #ebebeb;
            font-size: 13px;
            &.is-active {
              color: $base-color-white;
              background: $base-color-blue;
              border: 1px solid $base-color-blue;
            }
          }
        }
      }
    }

    .more {
      display: flex;
      align-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
</style>
