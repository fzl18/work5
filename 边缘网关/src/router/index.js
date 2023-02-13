import Vue from 'vue'
import VueRouter from 'vue-router'
import { publicPath, routerMode } from '@/config'
import Layout from '@/core/layouts'

Vue.use(VueRouter)

export const asyncRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: '/device/index',
    meta: {
      title: '首页',
      remixIcon: 'home-7-line',
    },
    hidden: true,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: {
      title: '登录',
    },
    hidden: true,
  },
  {
    path: '/device',
    name: 'device',
    component: Layout,
    redirect: '/device/index',
    meta: {
      title: '边缘网关',
    },
    children: [
      {
        path: 'index',
        name: 'deviceIndex',
        component: () => import('@/views/device'),
        meta: {
          title: '设备接入',
          remixIcon: 'bt-devices',
          isCustomSvgIcon: true,
        },
      },
      {
        path: 'maintain/:id?',
        name: 'deviceMaintain',
        component: () => import('@/views/device/maintain'),
        hidden: true,
        meta: {
          title: '设备接入',
        },
      },
      {
        path: 'watch/:id?',
        name: 'deviceWatch',
        component: () => import('@/views/device/watch'),
        hidden: true,
        meta: {
          title: '实时数据查看',
        },
      },
    ],
  },
  {
    path: '/flow',
    name: 'flow',
    component: Layout,
    redirect: '/flow/list',
    meta: {
      title: '流程引擎',
      remixIcon: 'bt-flow',
      isCustomSvgIcon: true,
    },
    children: [
      {
        path: 'list',
        name: 'flowList',
        component: () => import('@/views/flow/list'),
        meta: {
          title: '流程列表',
          remixIcon: 'bt-flow',
          isCustomSvgIcon: true,
        },
      },
      {
        path: 'index/:id?',
        name: 'flowIndex',
        component: () => import('@/views/flow'),
        meta: {
          title: '流程引擎',
        },
        hidden: true,
      },
    ],
  },
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: Layout,
  //   redirect: '/home/index',
  //   meta: {
  //     title: '边缘网关',
  //   },
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'homeIndex',
  //       component: () => import('@/views/home/welcome'),
  //       meta: {
  //         title: '首页',
  //         remixIcon: 'bug-line',
  //       },
  //     },
  //   ],
  // },

  // {
  //   path: '/gateway',
  //   name: 'gateway',
  //   component: Layout,
  //   redirect: '/gateway/index',
  //   meta: {
  //     title: '边缘网关',
  //   },
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'gatewayIndex',
  //       component: () => import('@/views/gatewaySettings'),
  //       meta: {
  //         title: '网关配置',
  //         remixIcon: 'bug-line',
  //       },
  //     },
  //   ],
  // },

  {
    path: '/logs',
    name: 'logs',
    component: Layout,
    redirect: '/logs/index',
    meta: {
      title: '边缘网关',
    },

    children: [
      {
        path: 'index',
        name: 'logIndex',
        component: () => import('@/views/logs/list'),
        meta: {
          title: '日志管理',
          remixIcon: 'bt-logs',
          isCustomSvgIcon: true,
        },
      },
    ],
  },
  {
    path: '/systemSettings',
    name: 'systemSettings',
    component: Layout,
    redirect: '/systemSettings/index',
    meta: {
      title: '边缘网关',
    },
    children: [
      {
        path: 'index',
        name: 'systemSettingsIndex',
        component: () => import('@/views/systemSettings'),
        meta: {
          title: '系统设置',
          remixIcon: 'bt-gateway',
          isCustomSvgIcon: true,
        },
      },
    ],
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/core/components/404'),
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
  routes: asyncRoutes,
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
    routes: asyncRoutes,
  }).matcher
}

export default router
