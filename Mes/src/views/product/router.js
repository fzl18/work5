import Layout from '@/core/layouts'

export default {
  path: '/product',
  component: Layout,
  meta: {
    title: '产品管理',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'rhythm',
      name: 'Rhythm',
      component: () => import('@/views/product/pages/rhythm'),
      meta: {
        title: '生产节拍设置',
        remixIcon: 'home-4-line',
      },
    },
    {
      path: 'product',
      name: 'Product',
      component: () => import('@/views/product/pages/product'),
      meta: {
        title: '产品信息',
        remixIcon: 'home-4-line',
      },
    },
    {
      path: 'document',
      name: 'Document',
      component: () => import('@/views/product/pages/document'),
      meta: {
        title: '产品图档',
        remixIcon: 'home-4-line',
      },
    },
    {
      path: 'sop',
      name: 'Sop',
      component: () => import('@/views/product/pages/sop'),
      meta: {
        title: '产品sop',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
