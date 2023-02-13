import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import '@/core'
import '@/components'
import API from './core/api/common'
import olMap from '@/module/inspect/components/olMap/index'
Vue.prototype.$api = API
Vue.config.productionTip = false
Vue.use(olMap)
let instance = null
function render({ container } = {}) {
  instance = new Vue({
    i18n,
    store,
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector('#vue-admin') : '#vue-admin')
}

if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('vue app bootstraped')
}

export async function mount(props) {
  console.log('props from main framework', props)
  render(props)
}

export async function unmount() {
  console.log('unmount')
  instance.$destroy()
  instance.$el.innerHTML = ''
  instance = null
}
