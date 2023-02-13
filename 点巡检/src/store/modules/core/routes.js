/**
 * @description 路由拦截状态管理，目前两种模式：server模式与frontEnd模式
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { getRouterList } from '@/core/api/router'
import { formatRouter, convertRouter, filterRoutes } from '@/utils/routes'
import { loginInterception } from '@/config'

const state = { routes: [], partialRoutes: [], generate: false }
const getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
  generate: (state) => state.generate,
}
const mutations = {
  setRoutes(state, routes) {
    state.routes = routes
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = routes
  },
  setGenerate(state, status) {
    state.generate = status
  },
}
const actions = {
  /**
   * @description 多模式设置路由
   * @param {*} { commit }
   * @param mode
   * @returns
   */
  async setRoutes({ commit }, mode = 'server') {
    let routes = asyncRoutes
    if (mode === 'server' && loginInterception) {
      let list = await getRouterList()
      let data = formatRouter(list)
      if (data[data.length - 1].path !== '*')
        data.push({ path: '*', redirect: '/404', hidden: true })
      routes = convertRouter(data)
    }
    const finallyRoutes = filterRoutes([...constantRoutes, ...routes])
    commit('setRoutes', finallyRoutes)
    commit('setGenerate', true)
    return [...routes]
  },
  /**
   * @description 画廊布局、综合布局设置路由
   * @param {*} { commit }
   * @param accessedRoutes 画廊布局、综合布局设置路由
   */
  setPartialRoutes({ commit }, accessedRoutes) {
    commit('setPartialRoutes', accessedRoutes)
  },
}
export default { state, getters, mutations, actions }
