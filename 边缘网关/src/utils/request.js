import Vue from 'vue'
import router from '@/router'
import axios from 'axios'
import {
  contentType,
  debounce,
  requestTimeout,
  tokenName,
  language,
  apiWhiteList,
} from '@/config'
import store from '@/store'
import qs from 'qs'

const baseURL = window.baseURL || process.env.VUE_APP_BASEAPI

let loadingInstance
let loadingTimer
let loadingTimeSpan = 80
const handleData = async ({ config, data }) => {
  // console.log('handleData', data)
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
  loadingTimer = setTimeout(() => {
    loadingInstance && loadingInstance.close()
  }, loadingTimeSpan)

  if (data.code === 200) {
    return data
  } else if (data.code === 401) {
    await store.dispatch('coreUser/logout')
    router.replace({
      path: '/login',
      query: {
        refUrl: encodeURIComponent(window.location.href),
      },
    })
  } else if (data.code === 500) {
    Vue.prototype.$baseMessage(data.msg, 'error')
    return Promise.reject(data)
  } else {
    Vue.prototype.$baseMessage(data.msg, 'error')
    return Promise.reject(data)
  }
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
      if (
        apiWhiteList.indexOf(config.url) === -1 &&
        store.getters['coreUser/accessToken']
      )
        config.headers[tokenName] = store.getters['coreUser/accessToken']
      if (
        config.data &&
        config.headers['Content-Type'] ===
          'application/x-www-form-urlencoded;charset=UTF-8'
      )
        config.data = qs.stringify(config.data)
      if (debounce.some((item) => config.url.includes(item))) {
      }

      if (config.skipLoading) {
        return config
      } else {
        if (loadingTimer) {
          clearTimeout(loadingTimer)
          loadingTimer = null
        }
        loadingTimer = setTimeout(
          () => {
            loadingInstance = Vue.prototype.$baseLoading()
          },
          loadingTimer ? loadingTimeSpan : 0
        )
        return config
      }
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
      // console.log(111, error)
      if (loadingTimer) {
        clearTimeout(loadingTimer)
        loadingTimer = null
      }
      loadingTimer = setTimeout(() => {
        loadingInstance && loadingInstance.close()
      }, loadingTimeSpan)
      if (error.config.skipErrorCatch) {
        return Promise.reject(error)
      } else {
        if (error.data && error.data.msg) {
          Vue.prototype.$baseMessage(data.msg, 'error')
        } else {
          Vue.prototype.$baseMessage(
            '系统发生错误，请联系运维人员检查服务器运行情况或配置信息',
            'error'
          )
        }

        return Promise.reject(error)
      }
    }
  )

  return instance
}
