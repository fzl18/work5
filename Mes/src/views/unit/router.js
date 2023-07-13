import Layout from '@/core/layouts'

export default {
  path: '/unit',
  component: Layout,
  meta: {
    title: '计量单位',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'index',
      name: 'UnitIndex',
      component: () => import('@/views/unit/pages/index'),
      meta: {
        title: '计量单位',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
