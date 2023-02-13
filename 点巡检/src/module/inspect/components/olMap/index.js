import VMap from './map/index'
import VTool from './tool/index'
import VOverlay from './overlay/index'
import VTile from './layers/tile/index'
import VSymbol from './layers/symbol/index'

const components = [VMap, VTool, VOverlay, VTile, VSymbol]

const install = function (Vue) {
  if (install.installed) return
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  ...components,
}

export { VMap, VTool, VOverlay, VTile, VSymbol }
