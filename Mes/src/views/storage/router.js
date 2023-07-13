import Layout from '@/core/layouts'

export default {
  path: '/storage',
  component: Layout,
  meta: {
    title: '仓库管理',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'storage',
      name: 'Storage',
      component: () => import('@/views/storage/pages/storage'),
      meta: {
        title: '仓库信息',
        remixIcon: 'home-4-line',
      },
    },
    {
      path: 'region',
      name: 'Region',
      component: () => import('@/views/storage/pages/region'),
      meta: {
        title: '库区信息',
        remixIcon: 'home-4-line',
      },
    },
    {
      path: 'place',
      name: 'Place',
      component: () => import('@/views/storage/pages/place'),
      meta: {
        title: '库位信息',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
