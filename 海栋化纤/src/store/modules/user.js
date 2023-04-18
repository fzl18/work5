/**
 * @description 登录、获取用户信息、退出登录、清除Token逻辑，不建议修改
 */
import Vue from 'vue'
import Cookies from 'js-cookie'
import { getUserInfo, ssoLogin } from '@/api/user'
import { login, logout, getMenu } from '@/views/ex-warehouse/api'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import router, { resetRouter } from '@/router'
import { title, tokenName } from '@/config'
import store from '@/store'

const state = {
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  hasLogin: false,
  roles: [],
  userGroup: null,
}
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  hasLogin: (state) => state.hasLogin,
  roles: (state) => state.roles,
  userGroup: (state) => state.userGroup,
}
const mutations = {
  /**
   * @description 设置Token
   * @param {*} state
   * @param {*} accessToken
   */
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
  },
  setHasLogin(state, status) {
    state.hasLogin = status
  },
  setRoles(state, roles) {
    state.roles = roles
  },
  setUserGroup(state, userGroup) {
    state.userGroup = userGroup
  },

  /**
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
}
const actions = {
  /**
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setAvatar', 'https://i.gtimg.cn/club/item/face/img/2/15922_100.gif')
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit }, userInfo) {
    const data = await login(userInfo)
    // if (!data) {
    //   Vue.prototype.$baseMessage('登录接口异常，请检查!', 'error')
    //   return false
    // }
    // const accessToken = data[tokenName]
    // console.log(data)
    if (data.id) {
      commit('setHasLogin', true)
      Cookies.set(`hasLogin`, true)
      commit('setUsername', data.name || '无名')
      localStorage.name = data.name
      const roles = []
      if (data.menu) {
        data.menu.map((item) => {
          if (item.name == 'bus') {
            item.childlist.map((val) => {
              if (val.ismenu) {
                roles.push(val.remark)
              }
            })
          }
        })
      }
      commit('setRoles', roles)
      commit('setUserGroup', data.group_id)
      let routeList = await store.dispatch('routes/setRoutes')
      router.addRoutes(routeList)

      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`${thisTime}！`, `欢迎登录${data.name}`)
    } else {
      // Vue.prototype.$baseMessage(`登录接口异常，未正确返回数据`, 'error')
    }
  },
  /**
   * @description 第三方登录
   * @param {*} {}
   * @param {*} JSESSIONID
   */
  async ssoLogin({ commit }, JSESSIONID = null) {
    if (JSESSIONID) Cookies.set(`JSESSIONID`, JSESSIONID)
    const { authData } = await ssoLogin(JSESSIONID)
    if (!authData.userToken) {
      Vue.prototype.$baseMessage(
        '登录接口异常，请检查返回数据是否正确',
        'error'
      )
      return false
    }
    const accessToken = authData['userToken']
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `login接口异常，请检查返回JSON格式是否正确，是否正确返回${tokenName}...`,
        'error'
      )
    }
  },
  /**
   * @description 获取用户信息接口
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit, dispatch, state }) {
    const { data } = await getUserInfo(state.accessToken)
    if (!data) {
      Vue.prototype.$baseMessage(
        'getUserInfo接口异常，请检查返回JSON格式是否正确，data字段是否为数组',
        'error'
      )
      return false
    }
    let { username, avatar, roles, ability } = data
    if (username && avatar) {
      commit('setUsername', username)
      commit('setAvatar', avatar)
      // 当不传递roles或ability时,默认使用管理员权限,可查看所有路由和按钮
      if (!roles && !ability) dispatch('acl/setFull', true, { root: true })
      // 当返回数据包含roles(角色)或ability(权限),保存至vuex
      // 如不使用roles权限控制,请不要传递roles,可删除以下代码
      if (roles instanceof Array) dispatch('acl/setRole', roles, { root: true })
      // 如不使用ability权限控制,请不要传递ability,可删除以下代码
      if (ability instanceof Array)
        dispatch('acl/setAbility', ability, { root: true })
    } else {
      Vue.prototype.$baseMessage(
        'getUserInfo接口异常，请检查返回JSON格式是否正确，roles字段是否为数组，是否与路由roles匹配',
        'error'
      )
    }
  },

  /**
   * @description 拿菜单
   * @param {*} { dispatch }
   */
  async getUserMenu({ commit, state }) {
    if (!state.userGroup) {
      let menu = await getMenu()
      commit('setUserGroup', menu.group_id)
      const roles = []
      if (menu && menu[3] && menu[3].name == 'bus') {
        menu[3].childlist.map((item) => {
          if (item.ismenu) {
            roles.push(item.remark)
          }
        })
      }
      commit('setRoles', roles)
      let routeList = await store.dispatch('routes/setRoutes')
      // console.log(routeList)
      router.addRoutes(routeList)
    }
  },
  /**
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    Cookies.set(`hasLogin`, false)
    await dispatch('resetAll')
    logout().then(() => {
      window.location.reload()
    })
  },
  /**
   * @description 重置accessToken、roles、ability、router等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ commit, dispatch }) {
    await dispatch('setAccessToken', '')
    await commit('setHasLogin', false)

    // await dispatch('acl/setFull', false, { root: true })
    // await dispatch('acl/setRole', [], { root: true })
    // await dispatch('acl/setAbility', [], { root: true })
    await resetRouter()
    removeAccessToken()
  },
  /**
   * @description 设置token
   */
  setAccessToken({ commit }, accessToken) {
    commit('setAccessToken', accessToken)
  },
}
export default { state, getters, mutations, actions }
