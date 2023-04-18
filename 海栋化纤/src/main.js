import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/core'
import Print from 'vue-print-nb'
Vue.config.productionTip = false
Vue.use(Print)
new Vue({
  el: '#vue-admin',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
