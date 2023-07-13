import Layout from '@/core/layouts'

export default {
  path: '/custom',
  component: Layout,
  meta: {
    title: '客户管理',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'index',
      name: 'CustomIndex',
      component: () => import('@/views/custom/pages/index'),
      meta: {
        title: '客户管理',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
