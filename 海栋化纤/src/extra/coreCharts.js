import 'echarts'
import 'echarts/map/js/china'
/* import "echarts/map/js/world"; */
import CoreChart from 'vue-echarts'
import theme from './core-echarts-theme.json'

CoreChart.registerTheme('core-echarts-theme', theme)
export default CoreChart
