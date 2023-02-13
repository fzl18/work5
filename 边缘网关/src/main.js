import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/core'
import '@/components'
import '@/style/base.scss'
import '@/style/transition.scss'
import dayjs from 'dayjs'

Vue.prototype.dayjs = dayjs
Vue.config.productionTip = false
new Vue({
  el: '#vue-admin',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
