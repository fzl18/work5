import VDraw from './index.vue'

VDraw.install = (Vue) => {
  Vue.component(VDraw.name, VDraw)
}

export default VDraw
