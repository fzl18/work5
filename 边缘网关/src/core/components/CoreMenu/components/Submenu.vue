<template>
  <el-submenu
    ref="subMenu"
    :index="item.fullPath"
    :popper-append-to-body="false"
  >
    <template slot="title">
      <remix-icon
        v-if="item.meta && item.meta.remixIcon"
        :is-svg="item.meta.isCustomSvgIcon"
        :icon-class="item.meta.remixIcon"
        class="remix-icon"
      ></remix-icon>
      <span>{{ translateTitle(item.meta.title) }}</span>
    </template>
    <slot></slot>
  </el-submenu>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'

  export default {
    name: 'Submenu',
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
    },
  }
</script>
