import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/core'
import '@/components'
// 适配flex
import '@/utils/flexible.js'
//引入echart
import * as echarts from 'echarts'
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
new Vue({
  el: '#vue-admin',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
