import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import Vconsole from "vconsole";
import "amfe-flexible";
Vue.config.productionTip = false;
// let vConsole = new Vconsole();
// Vue.use(vConsole);
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
