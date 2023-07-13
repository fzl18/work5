import Layout from '@/core/layouts'

export default {
  path: '/system',
  component: Layout,
  meta: {
    title: '系统管理',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'tree',
      name: 'Tree',
      component: () => import('@/views/system/pages/tree'),
      meta: {
        title: '组织架构',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
