import Layout from '@/core/layouts'

export default {
  path: '/purveyor',
  component: Layout,
  meta: {
    title: '供应商管理',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'purveyor',
      name: 'Purveyor',
      component: () => import('@/views/purveyor/pages/purveyor'),
      meta: {
        title: '供应商管理',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
