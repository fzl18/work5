// 加载所有的右侧菜单组件
const rightPanelComponents = {}
const requireComponent = require.context('./', true, /\.vue$/)
requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName)
  const componentName = componentConfig.default.name
  rightPanelComponents[componentName] =
    componentConfig.default || componentConfig
})

export default rightPanelComponents
