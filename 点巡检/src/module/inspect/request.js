import Vue from 'vue'
import axios from 'axios'
import { baseURL, contentType, debounce, language, requestTimeout, tokenName, } from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'

let loadingInstance
const handleData = ({ config, data }) => {
  if (loadingInstance) loadingInstance.close()
  let { success, errorCode, errorMsg, code = '' } = data
  let res = data.data
  // console.log(data)
  if (success || code === '200') {
    return data
  }
  // 提醒接口报错消息
  if (!success || code !== '200') {
    /* const msg = !success
      ? `后端接口 ${config.url} 异常 ${errorCode}：${errorMsg}`
      : `` */
    const msg = !success ? errorMsg : ``

    switch (errorCode) {
      case `401`:
        store.dispatch('coreUser/resetAll').catch(() => {})
        window.location.href = `${
          res.redirectUrl
        }${ router.history.pending.path.substr(1) }`
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
      config.headers[language] = store.getters['coreSettings/language'] || 'zh'
      if (store.getters['coreUser/accessToken'])
        config.headers[tokenName] = store.getters['coreUser/accessToken']

      if (store.getters['coreCommon/userinfo']) {
        config.headers['cnt-current-user-code'] =
          store.getters['coreCommon/userinfo'].userCode
        config.headers['cnt-current-top-unit'] =
          store.getters['coreCommon/userinfo'].topUnit
      }
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
