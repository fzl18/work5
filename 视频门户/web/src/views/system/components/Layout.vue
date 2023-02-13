<template>
  <div class="layer">
    <app-main></app-main>
  </div>
</template>

<script>
  export default {
    name: 'Layout',
    data() {
      return {}
    },
  }
</script>

<style lang="scss" scoped>
  .layer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
</style>
