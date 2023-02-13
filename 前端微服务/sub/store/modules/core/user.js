/**
 * @description 登录、获取用户信息、退出登录、清除Token逻辑，不建议修改
 */
import Vue from 'vue'
import Cookies from 'js-cookie'
import { getUserInfo, login, logout, ssoLogin } from '@/core/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import router, { resetRouter } from '@/router'
import { title, tokenName } from '@/config'

const state = {
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
}
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
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
    const { data } = await login(userInfo)
    if (!data) {
      Vue.prototype.$baseMessage('登录接口异常，请检查!', 'error')
      return false
    }
    const accessToken = data[tokenName]
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
      Vue.prototype.$baseNotify(`${thisTime}！`, `欢迎登录${title}`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
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
    const accessToken = `Bearer ${authData['userToken']}`
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
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    await dispatch('resetAll')
    logout().then((res) => {
      window.location.href = res.redirectUrl
    })
  },
  /**
   * @description 重置accessToken、router等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ dispatch }) {
    await dispatch('setAccessToken', '')
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
