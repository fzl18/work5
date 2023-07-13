import Layout from '@/core/layouts'

export default {
  path: '/device',
  component: Layout,
  meta: {
    title: '设备管理',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'device',
      name: 'Device',
      component: () => import('@/views/device/pages/device'),
      meta: {
        title: '设备档案',
        remixIcon: 'home-4-line',
      },
    },
  ],
}
