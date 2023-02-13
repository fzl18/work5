import Layout from '@/core/layouts'

export default {
  path: '/system',
  component: Layout,
  // redirect: '/system/index',
  meta: {
    title: '视频门户',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'index',
      name: 'Index',
      // hidden: true,
      component: () => import('@/views/system/pages/category'),
      meta: {
        title: '分类管理',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'class',
      name: 'Class',
      // hidden: true,
      component: () => import('@/views/system/pages/class'),
      meta: {
        title: '视频管理',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'pushVideo',
      name: 'PushVideo',
      // hidden: true,
      component: () => import('@/views/system/pages/pushVideo'),
      meta: {
        title: '发布视频',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'transform',
      name: 'Transform',
      component: () => import('@/views/system/pages/transform'),
      meta: {
        title: '转换管理',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('@/views/system/pages/setting'),
      meta: {
        title: '播放设置',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'log',
      name: 'Log',
      component: () => import('@/views/system/pages/log'),
      meta: {
        title: '系统日志',
        remixIcon: 'tools-line',
      },
    },
  ],
}
