<template>
  <component
    :is="menuComponent"
    v-if="!item.hidden"
    :item="item"
    :route-children="routeChildren"
  >
    <el-scrollbar
      v-if="
        item.children && item.children.length > 18 && layout === 'horizontal'
      "
      style="height: 86vh"
    >
      <template v-if="item.children && item.children.length">
        <core-menu
          v-for="route in item.children"
          :key="route.fullPath"
          :item="route"
        ></core-menu>
      </template>
    </el-scrollbar>
    <template v-else-if="item.children && item.children.length">
      <core-menu
        v-for="route in item.children"
        :key="route.fullPath"
        :item="route"
      ></core-menu>
    </template>
  </component>
</template>

<script>
  export default {
    name: 'CoreMenu',
    props: {
      item: {
        type: Object,
        required: true,
      },
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        routeChildren: {},
        menuComponent: '',
      }
    },
    created() {
      const showChildren = this.handleChildren(this.item.children)
      if (showChildren.length === 0) {
        this.menuComponent = 'MenuItem'
        this.routeChildren = this.item
      } else {
        this.menuComponent = 'Submenu'
      }
    },
    methods: {
      handleChildren(children = []) {
        if (children === null) return []
        return children.filter((item) => item.hidden !== true)
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep() {
    .el-tag {
      float: right;
      height: 16px;
      padding-right: 4px;
      padding-left: 4px;
      margin-top: calc((#{$base-menu-item-height} - 16px) / 2 + 1px);
      line-height: 16px;
      border: 0;
    }
  }
</style>
