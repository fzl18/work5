import router from '@/router'
import path from 'path'
import { rolesControl } from '@/config'
import { isExternal } from '@/utils/validate'
import { hasRole } from '@/utils/hasRole'

/**
 * @description server模式渲染后端返回路由,支持包含module路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/core/layouts'], resolve)
      } else {
        const index = route.component.indexOf('module')
        const path =
          index > 0 ? route.component.slice(index) : `module/${route.component}`
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    } else {
      route.component = (resolve) =>
        require(['@/core/layouts/keepalive'], resolve)
    }
    if (route.children && route.children.length)
      route.children = convertRouter(route.children)
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
}

/**
 * @description 处理返回的数据格式问题
 * @param asyncRoutes
 * @returns {*}
 */
export function formatRouter(asyncRoutes) {
  const routeList = JSON.parse(JSON.stringify(asyncRoutes))
  try {
    let newRoutelist = menuLoop(routeList)
    asyncRoutes = newRoutelist
  } catch {
    console.log('菜单解析出错了，请检查数据！')
  }
  return asyncRoutes
}
/**
 * @description 如果有权限：roles数组拦截路由
 * @param routes
 * @param baseUrl
 * @returns {[]}
 */
export function filterRoutes(routes, baseUrl = '/') {
  return routes
    .filter((route) => {
      if (rolesControl && route.meta && route.meta.roles)
        return hasRole(route.meta.roles)
      else return true
    })
    .map((route) => {
      if (route.path !== '*' && !isExternal(route.path))
        route.path = path.resolve(baseUrl, route.path)
      route.fullPath = route.path
      if (route.children)
        route.children = filterRoutes(route.children, route.fullPath)
      return route
    })
}

/**
 * 根据当前页面firstMenu
 * @returns {string}
 */
export function handleFirstMenu() {
  const firstMenu = router.currentRoute.matched[0].path
  if (firstMenu === '') return '/'
  return firstMenu
}

export function menuLoop(data, subNode) {
  const newData = []
  data.map((item, index) => {
    let hasSubNode = item.children && item.children.length
    let Obj = {
      path: item.menuUri,
      component: item.menuComponent,
      name: item.menuName,
      redirect: item.menuRedirect == '/index' ? '' : item.menuRedirect,
      activeMenu: subNode ? data[index].path : '',
      allwaysShow: item.allwaysShow || false,
      meta: {
        title: item.menuName,
        remixIcon: item.menuIcon,
        code: item.menuCode,
      },
    }
    if (hasSubNode) {
      Obj.children = menuLoop(item.children, (subNode = true))
    }
    newData.push(Obj)
  })
  return newData
}

/**
 * 处理后端返回的菜单
 */
export function formatMenu(val) {
  val.forEach((item) => {
    item.meta = {}
    item.meta.title = item.localOptName ? item.localOptName : ''
    item.meta.remixIcon = item.icon ? item.icon : 'menu-fill'
    item.path = item.optRoute ? item.optRoute : ''
    item.fullPath = item.optRoute ? item.optRoute : ''
    if (item.icon) {
      item.meta.imgUrl = item.icon
    }
    if (item.children) {
      formatMenu(item.children)
    }
  })
  return val
}

/**
 * 开发模式下处理本地路由
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
