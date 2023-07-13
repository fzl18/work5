/**
 * @description 登录、获取用户信息、退出登录、清除Token逻辑，不建议修改
 */
import Vue from 'vue'
import Cookies from 'js-cookie'
import { logout, ssoLogin } from '@/core/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import {
  getLoginName,
  getUserName,
  getUserInfo,
  setUserInfo,
  removeUserInfo,
} from '@/utils/userInfo'
import { getUserOpts, setUserOpts, removeUserOpts } from '@/utils/userOpts'
import router, { resetRouter } from '@/router'
import { title, tokenName } from '@/config'

const state = {
  accessToken: getAccessToken(),
  userInfo: getUserInfo(),
  userPowers: getUserOpts(),
  loginName: getLoginName(),
  userName: getUserName(),
  avatar: '',
}
const getters = {
  accessToken: (state) => state.accessToken,
  userInfo: (state) => state.userInfo,
  userPowers: (state) => state.userPowers,
  loginName: (state) => state.loginName,
  userName: (state) => state.userName,
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
   * @description 设置用户信息
   * @param {*} state
   * @param {*} userInfo
   */
  setUserinfo(state, userInfo) {
    state.userInfo = userInfo
    setUserInfo(userInfo)
  },
  /**
   * @description 设置用户权限
   * @param {*} state
   * @param {*} pyload
   */
  setUserPowers(state, pyload) {
    state.userPowers = pyload
    setUserOpts(pyload)
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} loginName
   */
  setLoginname(state, loginName) {
    state.loginName = loginName
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} userName
   */
  setUsername(state, userName) {
    state.userName = userName
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
    commit('setLoginname', 'admin(未开启登录拦截)')
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
    if (!authData.userToken || !authData.userInfo) {
      Vue.prototype.$baseMessage(
        '登录接口异常，请检查返回数据是否正确',
        'error'
      )
      return false
    }
    const userInfo = authData.userInfo
    if (authData.userTimeZone) {
      userInfo.userTimeZone = authData.userTimeZone
    }
    commit('setUserinfo', userInfo)

    if (userInfo && userInfo.loginName)
      commit('setLoginname', userInfo.loginName)

    if (userInfo && userInfo.userName) commit('setUsername', userInfo.userName)

    const userOpts = authData.userInfo.userOptList
    if (userOpts) commit('setUserPowers', userOpts)

    const accessToken = `Bearer ${authData['userToken']}`
    if (accessToken) {
      commit('setAccessToken', accessToken)
    }

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
    setTimeout(() => {
      Vue.prototype.$baseNotify(`${thisTime}！`, `欢迎登录${title}`)
    }, 1000)
  },

  /**
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }, returnUrl = window.location.href) {
    Cookies.set(`JSESSIONID`, null)
    await dispatch('resetAll')
    logout({ returnUrl }).then((res) => {
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
    removeUserInfo()
    removeUserOpts()
  },
  /**
   * @description 设置token
   */
  setAccessToken({ commit }, accessToken) {
    commit('setAccessToken', accessToken)
  },
}
export default { state, getters, mutations, actions }
