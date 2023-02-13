import Vue from 'vue'
import axios from 'axios'
import {
  baseURL,
  contentType,
  debounce,
  requestTimeout,
  tokenName,
  language,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'

let loadingInstance
const handleData = (response) => {
  let { config, data } = response

  if (loadingInstance) loadingInstance.close()

  if (config.resType === 'all') {
    return response
  }

  return data
  let { success, errorCode, errorMsg } = data
  let res = data.data

  if (success) {
    return res
  }
  // 提醒接口报错消息
  if (!success) {
    const msg = !success
      ? `后端接口 ${config.url} 异常 ${errorCode}：${errorMsg}`
      : ``

    switch (errorCode) {
      case `401`:
        store.dispatch('coreUser/resetAll').catch(() => {})
        window.location.href = `${
          res.redirectUrl
        }${router.history.pending.path.substr(1)}`
        break
      // case `403`:
      //   router.push({ path: '/403' }).catch(() => {})
      //   break
      default:
        Vue.prototype.$baseMessage(msg, 'error')
        throw new Error(errorMsg)
        break
    }
  }
  return data
}

export default (url) => {
  /**
   * @description axios初始化
   */

  //  requestTimeout
  const instance = axios.create({
    baseURL: url || baseURL,
    timeout: 20000,
    headers: {
      'Content-Type': contentType,
    },
  })
  /**
   * @description axios请求拦截器
   */
  instance.interceptors.request.use(
    (config) => {
      let i18n = store.getters['coreSettings/language'] || 'zh-CN'
      config.headers[language] = i18n
      if (store.getters['coreUser/accessToken'])
        config.headers[tokenName] = store.getters['coreUser/accessToken']

      if (store.getters['coreCommon/userinfo']) {
        config.headers['cnt-current-user-code'] =
          store.getters['coreCommon/userinfo'].userCode
        config.headers['cnt-current-top-unit'] =
          store.getters['coreCommon/userinfo'].topUnit
      }
      // config.headers['cnt-current-user-code'] = 'u0000000'
      // config.headers['cnt-current-top-unit'] = '1'
      if (
        config.data &&
        config.headers['Content-Type'] ===
          'application/x-www-form-urlencoded;charset=UTF-8'
      )
        config.data = qs.stringify(config.data)
      if (debounce.some((item) => config.url.includes(item)))
        loadingInstance = Vue.prototype.$baseLoading()
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  /**
   * @description axios响应拦截器
   */
  instance.interceptors.response.use(
    (response) => handleData(response),
    (error) => {
      if (loadingInstance) loadingInstance.close()
      const { response } = error
      if (response === undefined) {
        Vue.prototype.$baseMessage(
          '未可知错误，可能是由于后端不支持跨域CORS或代理配置无效引起',
          'error'
        )
        return {}
      } else return handleData(response)
    }
  )

  return instance
}
