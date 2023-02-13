/**
 * @description 路由拦截状态管理，目前两种模式：server模式与frontEnd模式
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { getRouterList } from '@/core/api/router'
import { formatMenu, formatLocalRoute } from '@/utils/routes'
import { loginInterception } from '@/config'
import { isMobile } from '@/utils'

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
    let menus = []
    let finallyMenus = []
    if (!isMobile()) {
      if (mode === 'server' && loginInterception) {
        const result = await getRouterList()
        result.forEach((item) => (menus = [...menus, ...item.children]))
        finallyMenus = formatMenu(menus)
      } else finallyMenus = formatLocalRoute(routes)
    }

    commit('setRoutes', finallyMenus)
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
