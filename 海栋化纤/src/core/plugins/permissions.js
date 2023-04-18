/**
 * @description 路由守卫，目前两种模式：server后端模式与frontEnd前端模式
 */
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import cookies from 'js-cookie'
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
  const showProgressBar = store.getters['settings/showProgressBar']
  if (showProgressBar) NProgress.start()
  let hasRoutes = store.getters['routes/generate']
  let roles = store.getters['user/roles']
  // 看是登录
  // let hasLogin = store.getters['user/hasLogin']
  let hasLogin = cookies.get('hasLogin')
  // console.log(hasLogin)
  // 如果关闭拦截
  if (!loginInterception) {
    hasLogin = true
    !loginInterception
  }
  //如果白名单，直接放行
  if (routesWhiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    //如果本地存在token 判断是否有路由
    if (hasLogin) {
      // if (roles.length) {
      //   next()
      // } else {
      //   await store.dispatch('user/getUserMenu')
      //   await store.dispatch('routes/setRoutes')
      //   next({ ...to, replace: true })
      // }
      // return
      if (!loginInterception) {
        next()
      }
      if (hasRoutes) {
        if (roles.length) {
          next()
        } else {
          await store.dispatch('user/getUserMenu')
          // let routeList = await store.dispatch(
          //   'routes/setRoutes',
          //   authentication
          // )
          // router.addRoutes(routeList)
          next()
        }
      } else {
        // 没有路由信息，去拿路由信息
        try {
          // 根据路由模式添加路由
          let routeList = await store.dispatch(
            'routes/setRoutes',
            authentication
          )
          router.addRoutes(routeList)
          next({ ...to, replace: true })
        } catch {
          // console.log('catch了')
          await store.dispatch('user/resetAll')
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
      // await store.dispatch('user/ssoLogin', to.query.JSESSIONID)
      // next({ ...to, replace: true })
      next({ path: '/login', replace: true })
    }
  }
})
router.afterEach((to) => {
  document.title = getPageTitle(to.meta.title)
  // console.log(to.path)
  if (NProgress.status) NProgress.done()
})
