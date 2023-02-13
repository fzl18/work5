import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/core'
import '@/components'
import Btplayer from '@/views/system/components/videoPlayer'
// 适配flex
import '@/utils/flexible.js'
//引入echart
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
Vue.component('Btplayer', Btplayer)
Vue.config.productionTip = false
new Vue({
  el: '#vue-admin',
  i18n,
  store,
  router,
  render: (h) => h(App),
})
