export default [

  { label: '新增故障代码', component: 'FaultClassAddFirstClass', children: [] },
  {
    label: '故障代码',
    component: 'FaultClass',
    children: [
      {
        label: '故障代码新增',
        component: 'FaultClassAdd',
        children: [],
      },
      {
        label: '故障代码编辑',
        component: 'FaultClassEdit',
        children: [],
      },
      {
        label: '故障代码表格编辑',
        component: 'FaultClassTableEdit',
        children: [],
      },
    ],
  },
]
