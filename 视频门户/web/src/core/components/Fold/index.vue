<template>
  <remix-icon
    v-if="collapse"
    :icon-class="collapse ? 'menu-fill' : 'function-fill'"
    class="fold-unfold"
    @click="toggleCollapse"
  ></remix-icon>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'Fold',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        collapse: 'coreSettings/collapse',
      }),
    },
    methods: {
      ...mapActions({
        toggleCollapse: 'coreSettings/toggleCollapse',
      }),
    },
  }
</script>
<style lang="scss" scoped>
  .fold-unfold {
    color: $base-color-gray;
    cursor: pointer;
  }
</style>
