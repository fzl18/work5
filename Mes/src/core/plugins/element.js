import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css'
import i18n from '@/i18n'
import '@/core/styles/element-variables.scss'
import XTable from 'vxe-table'
import XTablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import XEUtils from 'xe-utils'
XTable.use(XTablePluginElement)
XTable.setup({
  zIndex: 99999,
  input: {
    size: 'small',
  },
  button: {
    size: 'small',
  },
  table: {
    autoResize: true,
  },
})
XTable.renderer.add('category', {
  renderDefault(renderOpts, params) {
    const { row, column } = params
    const { events = {} } = renderOpts
    return (
      <a class="link" onClick={() => events.click(params)}>
        {row[column.field]}{' '}
      </a>
    )
  },
})
XTable.formats.mixin({
  // 格式化布尔值
  formatBoolean({ cellValue }) {
    return cellValue ? (cellValue === '1' ? '是' : '否') : ''
  },
  formatNodata({ cellValue }) {
    return cellValue || '-'
  },
  // 格式化日期，默认 yyyy-MM-dd HH:mm:ss
  formatDate({ cellValue }, format) {
    return XEUtils.toDateString(cellValue, format || 'yyyy-MM-dd HH:mm:ss')
  },
  // 四舍五入金额，每隔3位逗号分隔，默认2位数
  formatAmount({ cellValue }, digits = 2) {
    return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits })
  },

  // 四舍五入,默认两位数
  formatFixedNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.round(cellValue, digits), digits)
  },
  // 向下舍入,默认两位数
  formatCutNumber({ cellValue }, digits = 2) {
    return XEUtils.toFixed(XEUtils.floor(cellValue, digits), digits)
  },
})
Vue.use(XTable, {
  i18n: (key, value) => i18n.t(key, value),
  translate: (key, args) => i18n.t(key, args),
})
Vue.prototype.$XTable = XTable
Vue.use(ElementUI, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value),
})
