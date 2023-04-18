/**
 * @description 路由拦截状态管理，目前两种模式：server模式与frontEnd模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes } from '@/router'
import { getRouterList } from '@/api/router'
import { formatRouter, convertRouter, filterRoutes } from '@/utils/routes'
import { loginInterception } from '@/config'
import store from '@/store'

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
    // if (mode === 'server' && loginInterception) {
    //   let data = await getRouterList()
    //   data = formatRouter(data)
    //   if (data[data.length - 1].path !== '*')
    //     data.push({ path: '*', redirect: '/404', hidden: true })
    //   routes = convertRouter(data)
    // }
    const roles = store.getters['user/roles']
    const userGroup = store.getters['user/userGroup']

    //     "rway": 送货申请单 对应  applylist
    //     "cway": 审核  对应   review
    //     "out":  出库单 对应 delivery
    //     "del":  送货单 对应 shipping
    //     "go":   出门证 对应 permit
    //     "rtn":  退货申请单 对应 returnOrder
    //     "stats":  统计查询 对应 count
    routes.map((item) => {
      // console.log(item)
      if (item.name == 'logistics') {
        item.children.map((val) => {
          // console.log(val, userGroup)
          if ((userGroup == 12 || userGroup == 4) && val.name == 'Info') {
            val.hidden = false
            // return
          }
          if (userGroup == 4 && val.name == 'Review') {
            val.hidden = false
            // return
          }
        })
      }
      if (item.name == 'info') {
        item.children.map((val) => {
          if (roles.includes('rway') && val.name == 'Customer') {
            val.hidden = false
            // return
          }
          if (roles.includes('out') && val.name == 'Transit') {
            val.hidden = false
            // return
          }
        })
      }
      if (item.name == 'imwarehouse') {
        item.children.map((val) => {
          if (roles.includes('uway') && val.name == 'list') {
            val.hidden = false
            // return
          }
          if (roles.includes('uway') && val.name == 'count2') {
            val.hidden = false
            // return
          }
        })
      }
      if (item.name == 'exwarehouse') {
        item.children.map((val) => {
          if (val.name == 'applylist' && roles.includes('rway')) {
            val.hidden = false
            // return
          }
          if (val.name == 'review' && roles.includes('cway')) {
            val.hidden = false
            // return
          }
          if (val.name == 'delivery' && roles.includes('out')) {
            val.hidden = false
            // return
          }
          if (val.name == 'shipping' && roles.includes('del')) {
            val.hidden = false
            // return
          }
          if (val.name == 'permit' && roles.includes('go')) {
            val.hidden = false
            // return
          }
          if (val.name == 'returnOrder' && roles.includes('rtn')) {
            val.hidden = false
            // return
          }
          if (val.name == 'count' && roles.includes('stats')) {
            val.hidden = false
            // return
          }
        })
      }
    })
    // console.log(routes)
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
