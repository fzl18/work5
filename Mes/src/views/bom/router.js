import Layout from '@/core/layouts'

export default {
  path: '/bom',
  component: Layout,
  meta: {
    title: 'BOM',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'index',
      name: 'BOMIndex',
      component: () => import('@/views/bom/pages/index'),
      meta: {
        title: 'BOM',
        remixIcon: 'home-4-line',
      },
    },
    {
      path: 'view',
      name: 'BOMView',
      component: () => import('@/views/bom/pages/view'),
      meta: {
        title: 'BOM正查',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
