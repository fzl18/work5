import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/core'
import '@/components'
import API from './core/api/common'
Vue.prototype.$api = API
import { registerMicroApps } from 'qiankun'

Vue.config.productionTip = false
new Vue({
  el: '#vue-admin',
  i18n,
  store,
  router,
  render: (h) => h(App),
})

registerMicroApps([
  {
    // 点巡检
    name: 'dailycheck',
    entry: '/dailycheck/',
    container: '#appContainer',
    activeRule: '/Microdailycheck',
  },
  {
    // 在线监测
    name: 'monitor',
    entry: '/monitor/',
    container: '#appContainer',
    activeRule: '/Micromonitor',
  },
  {
    // 云通讯
    name: 'msg',
    entry: '/msg/',
    container: '#appContainer',
    activeRule: '/Micromsg',
  },
  {
    // 文件系统
    name: 'fileBase',
    entry: '/fileBase/',
    container: '#appContainer',
    activeRule: '/MicrofileBase',
  },
])
