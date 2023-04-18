<template>
  <remix-icon
    v-if="showRefresh"
    icon-class="refresh-line"
    @click="refreshRoute"
  ></remix-icon>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Refresh',
    computed: {
      ...mapGetters({
        showRefresh: 'settings/showRefresh',
      }),
    },
    methods: {
      async refreshRoute() {
        this.$baseEventBus.$emit('reload-router-view')
      },
    },
  }
</script>
