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
const handleData = (response) => {
  let { config, data } = response

  if (loadingInstance) loadingInstance.close()

  if (config.resType === 'all') {
    return response
  }

  return data
}

export default (url) => {
  /**
   * @description axios初始化
   */

  const instance = axios.create({
    baseURL: url || baseURL,
    // timeout: requestTimeout,
    timeout: 180000,
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
