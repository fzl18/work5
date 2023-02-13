import VSymbol from './index.vue'

VSymbol.install = (Vue) => {
  Vue.component(VSymbol.name, VSymbol)
}

export default VSymbol
