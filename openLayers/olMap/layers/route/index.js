import VRoute from './index.vue'

VRoute.install = (Vue) => {
  Vue.component(VRoute.name, VRoute)
}

export default VRoute
