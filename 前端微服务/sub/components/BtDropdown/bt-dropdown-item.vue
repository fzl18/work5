<template>
  <el-dropdown-item
    :disabled="isDisabled === 1 ? true : false"
    @click.native="_click"
  >
    <slot></slot>
  </el-dropdown-item>
</template>
<script>
  export default {
    name: 'BtDropdownItem',
    props: {
      isDisabled: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      _click() {
        this.$emit('click')
      },
    },
  }
</script>
<style lang="scss" scoped>
  .bt-dropdown-li {
    list-style: none;
  }
</style>
