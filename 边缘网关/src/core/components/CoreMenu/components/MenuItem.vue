<template>
  <el-menu-item
    class="menu-item"
    :index="routeChildren.fullPath"
    @click="handleLink"
  >
    <div class="icon-wrap">
      <remix-icon
        v-if="routeChildren.meta && routeChildren.meta.remixIcon"
        :is-svg="routeChildren.meta.isCustomSvgIcon"
        :icon-class="routeChildren.meta.remixIcon"
        class="remix-icon custom-remix-icon"
      ></remix-icon>
    </div>

    <span>{{ translateTitle(routeChildren.meta.title) }}</span>
    <el-tag
      v-if="routeChildren.meta && routeChildren.meta.badge"
      effect="dark"
      type="danger"
    >
      {{ routeChildren.meta.badge }}
    </el-tag>
  </el-menu-item>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { isExternal } from '@/utils/validate'

  export default {
    name: 'MenuItem',
    props: {
      item: {
        type: Object,
        default() {
          return null
        },
      },
      routeChildren: {
        type: Object,
        default() {
          return null
        },
      },
    },
    methods: {
      translateTitle,
      handleLink() {
        const routePath = this.routeChildren.fullPath
        const target = this.routeChildren.meta.target
        if (target === '_blank') {
          if (isExternal(routePath)) {
            window.open(routePath)
          } else if (this.$route.path !== routePath) {
            window.open(routePath.href)
          }
        } else {
          if (isExternal(routePath)) {
            window.location.href = routePath
          } else if (this.$route.path !== routePath) {
            this.$router.push(routePath)
          }
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
  .menu-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &:hover,
    &.is-active {
      .icon-wrap {
        background-color: #448ee8;
      }
    }
  }
  .icon-wrap {
    width: 28px;
    height: 28px;
    background-color: #b2bbc3;
    margin-right: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
  }
  .custom-remix-icon {
    width: 100% !important;
    height: 100% !important;
    padding: 4px !important;
  }
</style>
