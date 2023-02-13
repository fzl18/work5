<template>
  <div class="hideBox">
    <div v-loading="loading" />
  </div>
</template>
<script>
  import { Loading } from 'element-ui'
  export default {
    name: 'Loading',
    props: {},
    data() {
      return {
        loading: true,
      }
    },
    computed: {},
    mounted() {},
    destroyed() {
      this.loading = false
    },
    methods: {},
  }
</script>
<style lang="scss">
  .hideBox {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-content: center;
  }
</style>
<style lang="scss"></style>
