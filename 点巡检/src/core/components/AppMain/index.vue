<template>
  <div v-if="routerView" class="app-main-container">
    <transition mode="out-in" name="fade-transform">
      <!--      <keep-alive :include="cachedRoutes" :max="keepAliveMaxNum"></keep-alive>-->
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view :key="$route.path" class="app-main-height" />
      </keep-alive>
      <router-view
        v-if="!$route.meta.keepAlive"
        :key="$route.path"
        class="app-main-height"
      />
    </transition>
    <footer v-if="!isQianKun" class="footer-copyright">
      Copyright
      <remix-icon icon-class="copyright-line" />
      {{ title }} {{ fullYear }} by {{ copyright }}
      <a
        href="https://beian.miit.gov.cn"
        style="margin-left: 20px; color: rgba(0, 0, 0, 0.45)"
        target="_blank"
      >
        苏ICP备2021031295
      </a>
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=32021402001483"
        style="
          display: inline-block;
          text-decoration: none;
          height: 20px;
          line-height: 20px;
          margin-left: 20px;
        "
      >
        <img src="@/assets/images/bico.png" style="float: left">
        <p
          style="
            float: left;
            height: 20px;
            line-height: 20px;
            margin: 0px 0px 0px 5px;
            color: #939393;
          "
        >
          苏公网安备 32021402001483号
        </p>
      </a>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { copyright, keepAliveMaxNum, title } from '@/config'

export default {
  name: 'AppMain',
  data() {
    return {
      show: false,
      fullYear: new Date().getFullYear(),
      copyright,
      title,
      keepAliveMaxNum,
      routerView: true,
      isQianKun: window.__POWERED_BY_QIANKUN__,
    }
  },
  computed: {
    ...mapGetters({
      visitedRoutes: 'coreTabsBar/visitedRoutes',
      device: 'coreSettings/device',
    }),
    cachedRoutes() {
      return this.visitedRoutes
        .filter((item) => !item.meta.noKeepAlive)
        .flatMap((item) => item.matched)
    },
  },
  watch: {
    $route: {
      handler() {
        if ('mobile' === this.device) {
          this.$store.dispatch('coreSettings/foldSideBar')
        }
      },
      immediate: true,
    },
  },
  created() {
    //重载所有路由
    this.$baseEventBus.$on('reload-routerview', () => {
      this.routerView = false
      this.$nextTick(() => {
        this.routerView = true
      })
    })
  },
}
</script>

<style lang="scss" scoped>
.app-main-container {
  position: relative;
  width: 100%;
  overflow: hidden;

  .app-main-height {
    min-height: $base-app-main-height;
  }

  .footer-copyright {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 $base-padding 0 $base-padding;
    color: rgba(0, 0, 0, 0.45);
    border-top: 1px dashed $base-border-color;

    i {
      margin: 0 5px;
    }
  }
}
</style>
