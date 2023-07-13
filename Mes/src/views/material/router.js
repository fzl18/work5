import Layout from '@/core/layouts'

export default {
  path: '/material',
  component: Layout,
  meta: {
    title: '物料管理',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'index',
      name: 'materialIndex',
      component: () => import('@/views/material/pages/index'),
      meta: {
        title: '物料管理',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
