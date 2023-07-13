<template>
  <!--  <keep-alive :include="cachedRoutes">-->
  <!--    <router-view :key="$route.path" />-->
  <!--  </keep-alive>-->
  <transition mode="out-in" name="fade-transform">
    <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum">
      <!-- <keep-alive v-if="$route.meta.keepAlive"> -->
      <router-view :key="$route.path"></router-view>
    </keep-alive>
    <!-- <router-view v-if="!$route.meta.keepAlive" :key="$route.path" /> -->
  </transition>
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'DynamicSegment',
    computed: {
      ...mapGetters({
        visitedRoutes: 'coreTabsBar/visitedRoutes',
      }),
      cachedRoutes() {
        return this.visitedRoutes
          .filter((item) => !item.meta.noKeepAlive)
          .flatMap((item) => item.matched)
      },
    },
  }
</script>
