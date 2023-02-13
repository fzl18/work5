/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在frontEnd模式下才会用� hidden:true                        是否显示在菜单中显示路由（默认值：false� allwaysShow:true                   当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false� name:"Demo"                        首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制（该项特别重要）
 * meta:{
    title:"title"                     菜单、面包屑、多标签页显示的名称
    target: '_blank',                 外链打开方式
    remixIcon:""                      remix图标
    isCustomSvgIcon:false,            是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名�  noKeepAlive:true                  当前路由是否不缓存（默认值：false�  affix:true                        当前路由是否固定多标签页
    badge:"New"                       badge小标签（只支持子级）
    tagHidden:true                    当前路由是否不显示多标签� }
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/core/layouts'
import { publicPath, routerMode } from '@/config'
import Api from '@/core/api/login'
import $api from '@/core/api/common'
import store from '../store'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/403',
    name: '403',
    component: () => import('@/core/components/403'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/core/components/404'),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home/index',
    meta: {
      title: '首页',
      remixIcon: 'home-4-line',
    },
  },
  {
    path: '/home',
    name: 'index',
    component: Layout,
    meta: {
      title: '主页',
      remixIcon: 'tools-line',
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/module/demoSystem/pages/zhuye'),
        meta: {
          title: '主页',
          remixIcon: 'tools-line',
        },
      },
    ],
  },
  {
    path: '/Microdailycheck/*',
    component: Layout,
  },
  {
    path: '/MicroMonitor/*',
    component: Layout,
  },
  {
    path: '/MicrofileBase/*',
    component: Layout,
  },
  {
    path: '/Micromsg/*',
    component: Layout,
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

// **************  以下内容请勿修改  *****************
const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

function hasChildren(val) {
  val.forEach((item) => {
    item.meta = {}
    item.meta.title = item.localOptName ? item.localOptName : ''
    item.meta.remixIcon = item.icon ? item.icon : ''
    item.path = item.optRoute ? item.optRoute : ''
    item.fullPath = item.optRoute ? item.optRoute : ''
    if (item.icon) {
      item.meta.imgUrl = item.icon
      // item.meta.imgUrl = `@/static/icon/${
      //   item.optRoute.split('/')[item.optRoute.split('/').length - 1]
      // }.png`
    }
    if (item.children) {
      hasChildren(item.children)
    }
  })
  return val
}
function hasUnitChildren(val) {
  val.forEach((item) => {
    item.id = item.unitCode
    if (item.children.length === 0) {
      delete item.children
    } else {
      hasUnitChildren(item.children)
    }
  })
  return val
}

router.beforeEach((to, from, next) => {
  let href = window.location.href
  let query = href.substring(href.indexOf('?') + 1)
  let vars = query.split('&')
  let pair = []
  let xtoken = ''
  let flag = false
  for (var i = 0; i < vars.length; i++) {
    pair = vars[i].split('=')
    if (pair[0] == 'xtoken') {
      xtoken = pair[1]
      flag = true
    }
  }
  if (flag) {
    document.cookie = 'SESSION=' + xtoken.replace('#/', '') + ';path=/'
    window.location.href = href.replace(
      vars.length == 1 ? '?xtoken=' + xtoken : 'xtoken=' + xtoken,
      ''
    )
    next()
  }
  Api.getLogin().then((res) => {
    if (res.code == 302) {
      window.location.href = `${$api.login}?redirectUrl=${href}`
    } else {
      if (store.state.coreCommon.userinfo.userCode) {
        next()
        return
      }

      new Promise((resolve, reject) => {
        // $api
        //   .getMenu({
        //     params: {
        //       topUnit: res.data.userInfo.topUnit,
        //       userCode: res.data.userInfo.userCode,
        //     },
        //   })
        //   .then(async (res) => {
        //     let userPower = []
        //     let allMenu = []
        //     await $api
        //       .getDictionary({ params: { catalogCode: 'GYHLWMENU' } })
        //       .then((res) => {
        //         res.data.forEach((item) => {
        //           userPower.push(item.dataCode)
        //         })
        //       })
        //     await res.data.forEach((item) => {
        //       userPower.forEach((it) => {
        //         if (item.optId === it) {
        //           item.children.forEach((it) => {
        //             allMenu.push(it)
        //           })
        //         }
        //       })
        //     })
        //     const arr = hasChildren(allMenu)
        //     arr.pop()
        //     arr.pop()
        //     arr.pop()
        //     arr.pop()
        //     arr.pop()
        //     arr.push({
        //       children: [
        //         {
        //           fullPath: 'fullPath',
        //           icon: 'file',
        //           path: '/fileBase/resource',
        //           meta: {
        //             imgUrl: '',
        //             title: '子应用一',
        //           },
        //         },
        //         {
        //           fullPath: '/fileBase',
        //           icon: 'file',
        //           path: '/fileBase/resource',
        //           meta: {
        //             imgUrl: '',
        //             title: '子应用二',
        //           },
        //         },
        //       ],
        //       fullPath: '/fileBase',
        //       icon: 'file',
        //       meta: {
        //         imgUrl: '',
        //         title: '子应用项',
        //       },
        //       path: '/fileBase/resource',
        //     })

        //     console.log(arr)
        //     store.commit('coreRoutes/setRoutes', arr)
        //   })
        $api
          .getAllUnits({
            params: {
              topUnit: res.data.userInfo.topUnit,
            },
          })
          .then((res) => {
            const arr = hasUnitChildren(res.data)
            store.commit('coreCommon/setAllUnits', arr)
          })
        $api
          .getUnitUsers({
            params: {
              topUnit: res.data.userInfo.topUnit,
              unitCode: res.data.userInfo.topUnit,
            },
          })
          .then((res) => {
            store.commit('coreCommon/setAllUser', res.data)
          })
        store.dispatch('coreCommon/setUserinfo', res.data.userInfo)
        localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
        store.dispatch('coreCommon/setUserPowers', res.data.userOptList)
        resolve('成功')
      })
        .then((res) => {
          next()
        })
        .catch((error) => {
          alert('请求出错')
        })
    }
  })
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

export function resetRouter() {
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher
}

export default router
