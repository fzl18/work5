import Vue from 'vue'
import axios from 'axios'
import {
  baseURL,
  contentType,
  debounce,
  requestTimeout,
  tokenName,
  language,
  timeZone,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'

let loadingInstance
const handleData = ({ config, data }) => {
  if (loadingInstance) loadingInstance.close()
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
        window.location.href = `${res.redirectUrl}${encodeURIComponent(
          window.location.href
        )}`
        break
      case `4041001`:
        router.push({ path: '/403' }).catch(() => {})
        break
      default:
        if (errorMsg) {
          Vue.prototype.$baseMessage(msg, 'error')
          throw new Error(errorMsg)
        } else {
          let err = '网络开小差了'
          Vue.prototype.$baseMessage(err, 'error')
          throw new Error(err)
        }
        break
    }
  }
  return data
}

export default (url) => {
  /**
   * @description axios初始化
   */
  const instance = axios.create({
    baseURL: url || baseURL,
    timeout: requestTimeout,
    headers: {
      'Content-Type': contentType,
    },
  })
  /**
   * @description axios请求拦截器
   */
  instance.interceptors.request.use(
    (config) => {
      let i18n = store.getters['coreSettings/language'] || 'zh'
      config.headers[language] = i18n
      let userInfo = store.getters['coreUser/userInfo']
      if (userInfo && userInfo.userTimeZone) {
        config.headers[timeZone] = userInfo.userTimeZone
      }
      if (store.getters['coreUser/accessToken'])
        config.headers[tokenName] = store.getters['coreUser/accessToken']
      if (
        config.data &&
        config.headers['Content-Type'] ===
          'application/x-www-form-urlencoded;charset=UTF-8'
      )
        config.data = qs.stringify(config.data)
      if (
        debounce.some((item) => config.url.includes(item)) &&
        !config.noLoading
      )
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
