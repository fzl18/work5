/**
 * @description 路由拦截状态管理，目前两种模式：server模式与frontEnd模式
 */
import { asyncRoutes } from '@/router'
import { formatLocalRoute } from '@/utils/routes'

const state = { routes: [], partialRoutes: [] }
const getters = {
  routes: () => formatLocalRoute(asyncRoutes),
  partialRoutes: (state) => state.partialRoutes,
}
const mutations = {
  setPartialRoutes(state, routes) {
    state.partialRoutes = routes
  },
}
const actions = {
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
