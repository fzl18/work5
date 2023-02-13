<template>
  <el-dropdown-menu slot="dropdown">
    <slot />
  </el-dropdown-menu>
</template>
<script>
  export default {
    name: 'BtDropdownMenu',
  }
</script>
<style lang="scss" scoped>
  .bt-dropdown-li {
    list-style: none;
  }
</style>
