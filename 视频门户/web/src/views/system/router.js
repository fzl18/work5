import Layout from '@/views/system/components/Layout'

export default {
  path: '/system',
  component: Layout,
  redirect: '/system/index',
  meta: {
    title: '视频门户',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'index',
      name: 'Index',
      // hidden: true,
      component: () => import('@/views/system/pages/index'),
      meta: {
        title: '首页',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'videoList',
      name: 'videoList',
      // hidden: true,
      component: () => import('@/views/system/pages/videoList'),
      meta: {
        title: '视频列表',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'videoSearch',
      name: 'videoSearch',
      hidden: true,
      component: () => import('@/views/system/pages/videoSearch'),
      meta: {
        title: '搜索视频',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'myFavorites',
      name: 'myFavorites',
      hidden: true,
      component: () => import('@/views/system/pages/videoSearch'),
      meta: {
        title: '我的收藏',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'myLike',
      name: 'myLike',
      hidden: true,
      component: () => import('@/views/system/pages/videoSearch'),
      meta: {
        title: '我的点赞',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'history',
      name: 'history',
      hidden: true,
      component: () => import('@/views/system/pages/videoSearch'),
      meta: {
        title: '历史记录',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'videoDetail',
      name: 'videoDetail',
      hidden: true,
      component: () => import('@/views/system/pages/videoDetail'),
      meta: {
        title: '视频详情',
        remixIcon: 'tools-line',
      },
    },
    // {
    //   path: 'transform',
    //   name: 'Transform',
    //   component: () => import('@/views/system/pages/transform'),
    //   meta: {
    //     title: '转换管理',
    //     remixIcon: 'tools-line',
    //   },
    // },
    // {
    //   path: 'setting',
    //   component: () => import('@/views/system/pages/setting'),
    //   meta: {
    //     title: '播放设置',
    //     remixIcon: 'tools-line',
    //   },
    // },
    // {
    //   path: 'log',
    //   component: () => import('@/views/system/pages/log'),
    //   meta: {
    //     title: '系统日志',
    //     remixIcon: 'tools-line',
    //   },
    // },
  ],
}
