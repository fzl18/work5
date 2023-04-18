import router from '@/router'
import path from 'path'
import { rolesControl } from '@/config'
import { isExternal } from '@/utils/validate'
import { hasRole } from '@/utils/hasRole'

/**
 * @description server模式渲染后端返回路由,支持包含views路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/core/layouts'], resolve)
      } else {
        const index = route.component.indexOf('views')
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
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
  asyncRoutes = [
    {
      path: '/',
      component: 'Layout',
      redirect: '/index',
      meta: {
        title: '首页',
        remixIcon: 'home-4-line',
        affix: true,
      },
      children: [
        {
          path: 'index',
          name: 'Index',
          component: '@/views/index',
          meta: {
            title: '首页',
            remixIcon: 'home-4-line',
            affix: true,
          },
        },
      ],
    },
    {
      path: '/core',
      name: 'Core',
      component: 'Layout',
      redirect: '/core/icon/remixIcon',
      alwaysShow: true,
      meta: {
        title: '组件',
        remixIcon: 'code-box-line',
      },
      children: [
        {
          path: 'roles',
          name: 'Role',
          component: '@/views/core/roles',
          meta: {
            title: '角色权限控制',
            remixIcon: 'user-3-line',
            badge: 'New',
          },
        },
        {
          path: 'editor',
          name: 'Editor',
          component: '@/views/core/editor',
          meta: {
            title: '编辑器',
            roles: ['admin'],
            remixIcon: 'edit-2-line',
          },
          children: [
            {
              path: 'richTextEditor',
              name: 'RichTextEditor',
              component: '@/views/core/editor/richTextEditor',
              meta: {
                title: '富文本编辑器',
                roles: ['admin'],
              },
            },
          ],
        },
        {
          path: 'upload',
          name: 'Upload',
          component: '@/views/core/upload',
          meta: {
            title: '上传',
            roles: ['admin'],
            remixIcon: 'chat-upload-line',
          },
        },
        {
          path: 'https://github.com/',
          name: 'ExternalLink',
          meta: {
            title: '外链',
            target: '_blank',
            roles: {
              role: ['admin', 'editor'],
              mode: 'oneOf',
            },
            remixIcon: 'external-link-line',
          },
        },
      ],
    },
    {
      path: '/setting',
      name: 'PersonnelManagement',
      component: 'Layout',
      redirect: '/setting/userManagement',
      meta: {
        title: '配置',
        remixIcon: 'user-settings-line',
        roles: ['admin'],
      },
      children: [
        {
          path: 'userManagement',
          name: 'UserManagement',
          component: '@/views/setting/userManagement',
          meta: {
            title: '用户管理',
            remixIcon: 'user-3-line',
          },
        },
        {
          path: 'roleManagement',
          name: 'RoleManagement',
          component: '@/views/setting/roleManagement',
          meta: {
            title: '角色管理',
            remixIcon: 'admin-line',
          },
        },
        {
          path: 'departmentManagement',
          name: 'DepartmentManagemen',
          component: '@/views/setting/departmentManagement',
          meta: {
            title: '部门管理',
            remixIcon: 'group-line',
          },
        },
        {
          path: 'menuManagement',
          name: 'MenuManagement',
          component: '@/views/setting/menuManagement',
          meta: {
            title: '菜单管理',
            badge: 'New',
            remixIcon: 'menu-2-fill',
          },
        },
      ],
    },
    {
      path: '/error',
      name: 'Error',
      component: 'Layout',
      redirect: '/error/403',
      meta: {
        title: '错误页',
        remixIcon: 'error-warning-line',
      },
      children: [
        {
          path: '403',
          name: 'Error403',
          component: '@/views/403',
          meta: {
            title: '403',
            remixIcon: 'error-warning-line',
          },
        },
        {
          path: '404',
          name: 'Error404',
          component: '@/views/404',
          meta: {
            title: '404',
            remixIcon: 'error-warning-line',
          },
        },
      ],
    },
  ]
  return asyncRoutes
}
/**
 * @description 如果有权限：roles数组拦截路由
 * @param routes
 * @param baseUrl
 * @returns {[]}
 */
export function filterRoutes(routes, baseUrl = '/') {
  // console.log(routes)
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
