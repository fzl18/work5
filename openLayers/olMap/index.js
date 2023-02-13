import VMap from './map/index'
import VTool from './tool/index'
import VOverlay from './overlay/index'
import VTile from './layers/tile/index'
import VVector from './layers/vector/index'
import VRoute from './layers/route/index'
import VGraphic from './layers/graphic/index'
import VDraw from './layers/draw/index'

const components = [
  VMap,
  VTool,
  VOverlay,
  VTile,
  VVector,
  VRoute,
  VGraphic,
  VDraw,
]

const install = function (Vue) {
  if (install.installed) return
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

//  全局引用可自动安装
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components,
}

export { VMap, VTool, VOverlay, VTile, VVector, VRoute, VGraphic, VDraw }
