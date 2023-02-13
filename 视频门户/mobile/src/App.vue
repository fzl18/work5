<template>
  <div id="app">
    <!-- <van-nav-bar
      :title="$route.meta.title"
      safe-area-inset-top
      class="topbar"
    /> -->
    <van-tabbar
      v-model="active"
      route
      active-color="#2668B4"
      inactive-color="#000"
      v-show="isShow"
    >
      <van-tabbar-item replace to="/">
        <span>首页</span>
        <template #icon="props">
          <img v-if="!props.active" src="./assets/home.png" alt="" />
          <img v-if="props.active" src="./assets/home-fill.png" alt="" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/videoList">
        <span>视频</span>
        <template #icon="props">
          <img v-if="!props.active" src="./assets/video.png" alt="" />
          <img v-if="props.active" src="./assets/video-fill.png" alt="" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item replace to="/user">
        <span>我的</span>
        <template #icon="props">
          <img v-if="!props.active" src="./assets/user.png" alt="" />
          <img v-if="props.active" src="./assets/user-fill.png" alt="" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <div class="body">
      <router-view />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabbar, TabbarItem, NavBar } from "vant";

Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(NavBar);

export default {
  data() {
    return {
      active: 0,
      isShow: true,
    };
  },
  watch: {
    $route(val) {
      switch (val.name) {
        case "User":
          this.isShow = true;
          break;
        case "Home":
          this.isShow = true;
          break;
        case "VideoList":
          this.isShow = true;
          break;
        default:
          this.isShow = false;
          break;
      }
    },
  },

  mounted() {},
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f6f6f7;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
#app .van-nav-bar {
  background: #f6f6f7;
}
.body {
  padding: 0 12px 80px 12px;
}
</style>
<style>
.van-dropdown-menu__bar {
  border-radius: 6px;
}
.van-dropdown-menu__item {
  justify-content: flex-start !important;
  padding: 15px;
}
.van-dropdown-item {
  margin: 0 10px;
}
</style>
