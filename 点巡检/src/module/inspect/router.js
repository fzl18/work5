import Layout from '@/core/layouts'

export default {
  path: '/inspect',
  component: Layout,
  meta: {
    title: '点巡检系统',
    remixIcon: 'tools-line',
  },
  children: [
    {
      path: 'index',
      name: 'Index',
      component: () => import('@/module/inspect/pages/index'),
      meta: {
        title: '点巡检首页',
        remixIcon: 'tools-line',
      },
    },
    /* {
      path: 'tenant',
      name: 'Tenant',
      component: () => import('@/module/inspect/pages/tenant'),
      meta: {
        title: '租户管理',
        remixIcon: 'tools-line',
      },
    }, */
    {
      path: 'system',
      name: 'System',
      component: () => import('@/core/layouts/keepalive'),
      meta: {
        title: '常规配置',
        remixIcon: 'tools-line',
      },
      children: [
        /* {
          path: 'factory',
          name: 'Factory',
          component: () => import('@/module/inspect/pages/factory'),
          meta: {
            title: '厂区管理',
            remixIcon: 'home-4-line',
          },
        },
        {
          path: 'workSpace',
          name: 'WorkSpace',
          component: () => import('@/module/inspect/pages/workSpace'),
          meta: {
            title: '作业区管理',
            remixIcon: 'home-4-line',
          },
        },
        {
          path: 'productLine',
          name: 'ProductLine',
          component: () => import('@/module/inspect/pages/productLine'),
          meta: {
            title: '输送线管理',
            remixIcon: 'home-4-line',
          },
        }, */
        {
          path: 'handSet',
          name: 'HandSet',
          component: () => import('@/module/inspect/pages/handSet'),
          meta: {
            title: '手持设备',
            remixIcon: 'home-4-line',
          },
        },
        {
          hiden: true,
          path: 'handSetAdd',
          name: 'handSetAdd',
          component: () => import('@/module/inspect/pages/handSet/handSetAdd'),
          meta: {
            title: '编辑',
            remixIcon: 'tools-line',
          },
        },
        {
          path: 'baseData',
          name: 'BaseData',
          component: () => import('@/module/inspect/pages/baseData'),
          meta: {
            title: '选项配置',
            remixIcon: 'home-4-line',
          },
        },
        {
          path: 'log',
          name: 'Log',
          component: () => import('@/module/inspect/pages/log'),
          meta: {
            title: '操作记录',
            remixIcon: 'home-4-line',
          },
        },
      ],
    },
    {
      path: 'spotCheck',
      name: 'SpotCheck',
      component: () => import('@/core/layouts/keepalive'),
      meta: {
        title: '点巡检',
        remixIcon: 'tools-line',
      },
      children: [
        {
          path: 'standard',
          name: 'Standard',
          component: () => import('@/module/inspect/pages/standard'),
          meta: {
            title: '点巡检标准',
            remixIcon: 'home-4-line',
          },
        },
        {
          hiden: true,
          path: 'standardAdd',
          name: 'standardAdd',
          component: () =>
            import('@/module/inspect/pages/standard/standardAdd'),
          meta: {
            title: '编辑',
            remixIcon: 'tools-line',
          },
        },
        {
          path: 'plan',
          name: 'Plan',
          component: () => import('@/module/inspect/pages/pollingPlan'),
          meta: {
            title: '点巡检计划',
            remixIcon: 'home-4-line',
          },
        },
        {
          hiden: true,
          path: 'planAdd',
          name: 'planAdd',
          component: () =>
            import('@/module/inspect/pages/pollingPlan/pollingPlanAdd'),
          meta: {
            title: '编辑',
            remixIcon: 'tools-line',
          },
        },
        {
          path: 'record',
          name: 'Record',
          component: () => import('@/module/inspect/pages/pollingRecord'),
          meta: {
            title: '点巡检记录',
            remixIcon: 'home-4-line',
          },
        },
      ],
    },
    {
      path: 'workOrder',
      name: 'WorkOrder',
      component: () => import('@/module/inspect/pages/workOrder'),
      meta: {
        title: '工单管理',
        remixIcon: 'tools-line',
      },
    },
    {
      hiden: true,
      path: 'workOrderAdd',
      name: 'workOrderAdd',
      component: () => import('@/module/inspect/pages/workOrder/workOrderAdd'),
      meta: {
        title: '编辑',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'scheduling',
      name: 'Scheduling',
      component: () => import('@/module/inspect/pages/scheduling'),
      meta: {
        title: '排班管理',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'equipmentRecords',
      name: 'EquipmentRecords',
      component: () => import('@/module/inspect/pages/equipmentRecords'),
      meta: {
        title: '设备记录',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'abnormalEquipment',
      name: 'AbnormalEquipment',
      component: () => import('@/module/inspect/pages/abnormalEquipment'),
      meta: {
        title: '设备异常',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'dataKanban',
      name: 'DataKanban',
      component: () => import('@/core/layouts/keepalive'),
      meta: {
        title: '数据看板',
        remixIcon: 'tools-line',
      },
      children: [
        {
          path: 'planTrend',
          name: 'PlanTrend',
          component: () => import('@/module/inspect/pages/planTrend'),
          meta: {
            title: '计划执行趋势',
            remixIcon: 'tools-line',
          },
        },
        {
          path: 'planActing',
          name: 'PlanActing',
          component: () => import('@/module/inspect/pages/planActing'),
          meta: {
            title: '计划执行统计',
            remixIcon: 'tools-line',
          },
        },
        {
          path: 'lineTrend',
          name: 'LineTrend',
          component: () => import('@/module/inspect/pages/lineTrend'),
          meta: {
            title: '产线统计',
            remixIcon: 'tools-line',
          },
        },
      ],
    },
    {
      path: 'preventMaintain',
      name: 'preventMaintain',
      component: () =>
        import('@/module/inspect/pages/preventMaintain/preventMaintainIndex'),
      meta: {
        title: '预防性维护管理',
        remixIcon: 'tools-line',
      },
    },
    {
      hiden: true,
      path: 'preventMaintainAdd',
      name: 'preventMaintainAdd',
      component: () =>
        import('@/module/inspect/pages/preventMaintain/preventMaintainAdd'),
      meta: {
        title: '编辑',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'faultClass',
      name: 'faultClass',
      component: () =>
        import('@/module/inspect/pages/faultClass/faultClassIndex'),
      meta: {
        title: '故障代码管理',
        remixIcon: 'tools-line',
      },
    },
    {
      path: 'basic-settings',
      name: 'basicSettings',
      component: () => import('@/core/layouts/keepalive'),
      meta: {
        title: '基础设置',
        remixIcon: 'tools-line',
      },
      children: [
        {
          path: 'area',
          name: 'Area',
          component: () => import('@/module/inspect/pages/basicSetting/area'),
          meta: {
            title: '区域设置',
            remixIcon: 'home-4-line',
          },
        },
        {
          path: 'equip-type',
          name: 'EquipmentType',
          component: () => import('@/module/inspect/pages/basicSetting/equipType'),
          meta: {
            title: '设备类别',
            remixIcon: 'home-4-line',
          },
        },
        {
          path: 'equip-position',
          name: 'EquipmentPos',
          component: () => import('@/module/inspect/pages/basicSetting/equipPos'),
          meta: {
            title: '设备位置',
            remixIcon: 'home-4-line',
          },
        }
      ],
    },
    {
      path: 'maint-schedule',
      name: 'maintSchedule',
      component: () => import('@/module/inspect/pages/maintSchedule/index'),
      meta: {
        title: '检修计划',
        remixIcon: 'tools-line',
      }
    }
  ],
}
