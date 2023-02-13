/**
 * @description 路由守卫，目前两种模式：server后端模式与frontEnd前端模式
 */
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import { getPageResource } from '@/core/api/router'
import { setEventTrack } from './eventTrack'
import { isMobile } from '@/utils'
import {
  authentication,
  loginInterception,
  recordRoute,
  routesWhiteList,
} from '@/config'

NProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeEach(async (to, from, next) => {
  const showProgressBar = store.getters['coreSettings/showProgressBar']
  const hasRoutes = store.getters['coreRoutes/generate']
  const dictionary = store.getters['systemIndex/dictionary']
  if (showProgressBar) NProgress.start()
  //埋点
  setEventTrack(to)
  // 看是否有本地token
  let hasToken = store.getters['coreUser/accessToken']
  // 如果关闭拦截
  if (!loginInterception) {
    hasToken = true
    // if (!dictionary.length) {
    //   await store.dispatch('systemIndex/getDictionary')
    // }
    if (hasRoutes) next()
  }
  //如果白名单，直接放行
  if (routesWhiteList.indexOf(to.path) !== -1) {
    if (!dictionary.length) {
      // await store.dispatch('systemIndex/getDictionary')
      next()
    } else {
      next()
    }
  } else {
    //如果本地存在token 判断是否有路由
    if (hasToken) {
      if (hasRoutes) {
        // if (!dictionary.length) {
        //   await store.dispatch('systemIndex/getDictionary')
        // }
        next()
      } else {
        // 没有路由信息，去拿路由信息
        try {
          // 根据路由模式添加路由
          let routeList = await store.dispatch(
            'coreRoutes/setRoutes',
            authentication
          )
          router.addRoutes(routeList)
          next({ ...to, replace: true })
        } catch {
          await store.dispatch('coreUser/resetAll')
          if (recordRoute && to.path !== '/')
            next({
              path: to.path,
              query: { redirect: to.redirect },
              replace: true,
            })
          else next({ path: '/', replace: true })
        }
      }
    } else {
      try {
        // console.log(to.query, to)
        await store.dispatch('coreUser/ssoLogin', to.query.JSESSIONID)
        next({ ...to, replace: true })
      } catch {
        NProgress.done()
      }
    }
  }
})

router.beforeResolve(async (to, from, next) => {
  if (loginInterception && !isMobile()) {
    let pageResource = await getPageResource({ menuCode: to.meta.code })
    to.meta.pageResource = pageResource
    next()
  } else {
    next()
  }
})

router.afterEach(async (to) => {
  document.title = getPageTitle(to.meta.title)
  if (NProgress.status) NProgress.done()
})
