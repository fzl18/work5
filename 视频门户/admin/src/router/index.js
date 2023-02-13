/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在frontEnd模式下才会用到
 * hidden:true                        是否显示在菜单中显示路由（默认值：false）
 * allwaysShow:true                   当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
 * name:"Demo"                        首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制（该项特别重要）
 * meta:{
    title:"title"                     菜单、面包屑、多标签页显示的名称
    target: '_blank',                 外链打开方式
    remixIcon:""                      remix图标
    isCustomSvgIcon:false,            是否是自定义svg图标（默认值：false，如果设置true，那么需要把你的svg拷贝到icon/remixIcon下，然后remixIcon字段配置上你的图标名）
    noKeepAlive:true                  当前路由是否不缓存（默认值：false）
    affix:true                        当前路由是否固定多标签页
    badge:"New"                       badge小标签（只支持子级）
    tagHidden:true                    当前路由是否不显示多标签页
   }
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/core/layouts'
import System from '@/views/system/router'
import { publicPath, routerMode } from '@/config'

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
    name: 'index',
    redirect: '/system/index',
    meta: {
      title: '首页',
      remixIcon: 'tools-line',
    },
  },
  System,
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
