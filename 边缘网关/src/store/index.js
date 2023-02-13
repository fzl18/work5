/**
 * @description 导入所有 vuex 模块，自动加入namespaced:true，用于解决vuex命名冲突，请勿修改。
 */
import Vue from 'vue'
import Vuex from 'vuex'
import { stringToCamel } from '@/utils'
Vue.use(Vuex)
const files = require.context('./modules', true, /\.js$/)
const modules = {}
files.keys().forEach((key) => {
  let keyName = stringToCamel(key.replace(/(\.\/|\.js)/g, ''))
  modules[keyName] = files(key).default
})
Object.keys(modules).forEach((key) => {
  modules[key]['namespaced'] = true
})

const store = new Vuex.Store({
  modules,
})
export default store
