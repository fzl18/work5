import router from '@/router'
import { pageWhiteList } from '@/config'
import store from '@/store'
/**
 * 根据当前页面firstMenu
 * @returns {string}
 */
export function handleFirstMenu() {
  const firstMenu = router.currentRoute.matched[0].path
  if (firstMenu === '') return '/'
  return firstMenu
}

/**
 * 处理本地路由
 */
export function formatLocalRoute(val, prefixPath = '') {
  val.forEach((item) => {
    item.fullPath = item.path ? prefixPath + item.path : ''
    if (item.children) {
      formatLocalRoute(item.children, item.fullPath + '/')
    }
  })
  return val
}

router.beforeEach((to, from, next) => {
  if (
    pageWhiteList.indexOf(to.path) === -1 &&
    (store.getters['coreUser/accessToken'] === '' ||
      !store.getters['coreUser/accessToken'])
  ) {
    next({ path: '/login' })
    return false
  }

  next()
})
