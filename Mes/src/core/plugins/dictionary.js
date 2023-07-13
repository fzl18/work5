import Vue from 'vue'

/* 全局获取字典选项名 */
Vue.prototype.$getDictionaryLabel = (
  options,
  value,
  value_key = 'dataCode',
  label_key = 'dataValue'
) => {
  let label = ''
  if (Array.isArray(options)) {
    const o = options.find((item) => item[value_key] == value)
    if (o) {
      label = o[label_key]
    }
  }
  return label
}
