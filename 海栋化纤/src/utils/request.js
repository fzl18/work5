import Vue from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import {
  baseURL,
  contentType,
  debounce,
  requestTimeout,
  tokenName,
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'

let loadingInstance
// const CODE_MESSAGE = {
//   200: '服务器成功返回请求数据',
//   201: '新建或修改数据成功',
//   202: '一个请求已经进入后台排队（异步任务）',
//   204: '删除数据成功',
//   400: '发出信息有误',
//   401: '用户没有权限（令牌、用户名、密码错误）',
//   403: '用户得到授权，但是访问是被禁止的',
//   404: '访问资源不存在',
//   406: '请求格式不可得',
//   410: '请求资源被永久删除，且不会被看到',
//   500: '服务器发生错误',
//   502: '网关错误',
//   503: '服务不可用，服务器暂时过载或维护',
//   504: '网关超时',
// }

const handleData = ({ config, data }) => {
  if (loadingInstance) loadingInstance.close()
  let { code, errorCode, errorMsg, msg } = data
  let res = data.data
  // 提醒接口报错消息
  if (code != 1) {
    switch (code) {
      // case 0:
      //   store.dispatch('user/resetAll').catch(() => {})
      //   window.location.href = `/`
      //   break
      case 3:
        // Cookies.set(`hasLogin`, false)
        router.push({ path: '/login' }).catch(() => {})
        break
      default:
        Vue.prototype.$baseMessage(msg, 'error')
        break
    }
  }
  return res
}

/**
 * @description axios初始化
 */
const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
    'X-Requested-With': 'XMLHttpRequest',
  },
})

/**
 * @description axios请求拦截器
 */
instance.interceptors.request.use(
  (config) => {
    if (store.getters['user/accessToken'])
      config.headers[tokenName] = store.getters['user/accessToken']
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

export default instance
