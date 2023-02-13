import Vue from 'vue'
import Message from './Message/index.js'
Vue.prototype.$msg = Message
// 加载组件
const requireComponent = require.context('./', true, /\.vue$/)
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})
