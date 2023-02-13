import VTool from './index.vue'

VTool.install = (Vue) => {
  Vue.component(VTool.name, VTool)
}

export default VTool
