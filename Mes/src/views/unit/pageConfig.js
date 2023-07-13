import { measureList } from './api'
export default {
  $unit$index: {
    search: {
      fields: {
        measureKey: '',
      },
      items: [
        {
          span: 24,
          children: [
            {
              field: 'measureKey',
              title: '编码/名称',
              span: 24,
              itemRender: {
                name: '$input',
                props: {
                  placeholder: '',
                },
              },
            },
          ],
        },
      ],
      getData: measureList,
    },
    main: {
      columns: [
        {
          field: 'code',
          title: '编码',
        },
        {
          field: 'name',
          title: '计量单位名称',
        },
        {
          field: 'accu',
          title: '精度',
        },
        {
          field: 'remark',
          title: '备注',
        },
        {
          field: 'createBy',
          title: '创建人',
        },
        {
          field: 'createTime',
          title: '创建时间',
        },
        {
          field: 'updateBy',
          title: '更新人',
        },
        {
          field: 'updateTime',
          title: '更新时间',
        },
      ],
    },
  },
}
