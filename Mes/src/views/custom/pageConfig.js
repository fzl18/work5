import { getCustomersList } from './api'
export default {
  $custom$index: {
    search: {
      fields: {
        unitUnionCode: '',
        code: '',
        name: '',
      },
      items: [
        {
          span: 24,
          children: [
            {
              field: 'code',
              title: '客户编码',
              span: 24,
              itemRender: {
                name: '$input',
                props: {
                  placeholder: '',
                },
              },
            },
            {
              field: 'name',
              title: '客户名称',
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
      getData: getCustomersList,
    },
    main: {
      columns: [
        {
          field: 'code',
          title: '客户编码',
        },
        {
          field: 'name',
          title: '客户名称',
        },
        {
          field: 'shortName',
          title: '简称',
        },
        {
          field: 'country',
          title: '国家',
        },
        {
          field: 'province',
          title: '省份',
        },
        {
          field: 'contacts',
          title: '联系人',
          slots: {
            default: 'mainColumnItem1',
          },
        },
        // {
        //   field: '',
        //   title: ('联系电话'),
        // },
        // {
        //   field: '',
        //   title: ('收件人1'),
        // },
        // {
        //   field: '',
        //   title: ('收件地址1'),
        // },
        // {
        //   field: '',
        //   title: ('收件人2'),
        // },
        // {
        //   field: '',
        //   title: ('收件地址2'),
        // },
        {
          field: 'remark',
          title: '备注',
        },
      ],
      operate: {
        button: ['view'],
      },
    },
  },
}

export const detail = {
  items: [
    {
      field: 'code',
      title: '客户编码',
      span: 8,
    },
    {
      field: 'name',
      title: '客户名称',
      span: 8,
    },
    {
      field: 'shortName',
      title: '简称',
      span: 8,
    },
    {
      field: 'country',
      title: '国家',
      span: 8,
    },
    {
      field: 'province',
      title: '省份',
      span: 8,
    },
    {
      field: 'contacts',
      title: '联系人',
      span: 24,
      slots: {
        default: 'contacts',
      },
    },
    // {
    //   field: 'tel',
    //   title: '联系电话',
    //   span: 8,
    // },
    // {
    //   field: 'recipient1',
    //   title: '收件人1',
    //   span: 8,
    // },
    // {
    //   field: 'add1',
    //   title: '收件地址1',
    //   span: 8,
    // },
    // {
    //   field: 'recipient2',
    //   title: '收件人2',
    //   span: 8,
    // },
    // {
    //   field: 'add2',
    //   title: '收件地址2',
    //   span: 8,
    // },
    {
      field: 'remark',
      title: '备注',
      span: 24,
    },
  ],
}
