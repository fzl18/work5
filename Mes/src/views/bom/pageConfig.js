import { getList, getSubStep, getSubDetail } from './api'
import { getMtCategorys } from '../material/api'
import { dictsOption } from '@/views/dictionaryApi.js'

const common = [
  {
    field: 'code',
    title: '子项物料编码',
    minWidth: '100',
  },
  {
    field: 'name',
    title: '子项物料名称',
    minWidth: '100',
  },
  {
    field: 'specific',
    title: '子项规格型号',
    minWidth: '100',
  },
  {
    field: 'property',
    title: '子项物料属性',
    minWidth: '100',
  },
  {
    field: 'unit',
    title: '子项单位',
    minWidth: '100',
  },
  {
    field: 'usageType',
    title: '用量类型',
    minWidth: '100',
  },
  {
    field: 'numberUsage',
    title: '用量：分子',
    minWidth: '100',
  },
  {
    field: 'denom',
    title: '用量：分母',
    minWidth: '100',
  },
  {
    field: 'fixedLoss',
    title: '固定损耗',
    minWidth: '100',
  },
]

async function config() {
  return {
    search: {
      fields: {
        unitUnionCode: '',
        code: '',
        name: '',
        property: '',
        groupName: '',
        psnDesc: '',
        version: '',
        haveChild: true,
        haveChildLastBomVersion: true,
      },
      items: [
        {
          field: 'code',
          title: '物料编码',
          span: 24,
          itemRender: {
            name: '$input',
            props: {
              placeholder: '',
            },
          },
          slots: {
            default: 'formItem1',
          },
        },
        {
          field: 'property',
          title: '物料属性',
          span: 24,
          itemRender: {
            name: '$select',
            options: await dictsOption('MATERIAL_PROPERTY'),
            props: {
              placeholder: '',
            },
          },
        },
        {
          field: 'name',
          title: '物料名称',
          span: 24,
          itemRender: {
            name: '$input',
            props: {
              placeholder: '',
            },
          },
        },
        // {
        //   field: 'groupName',
        //   title: ('物料类别'),
        //   span: 24,
        //   itemRender: {
        //     name: '$input',
        //     options: await dictsOption('MATERIAL_TYPE'),
        //     props: {
        //       placeholder: '',
        //     },
        //   },
        // },
        {
          field: 'psnDesc',
          title: '规格型号',
          span: 24,
          itemRender: {
            name: '$input',
            props: {
              placeholder: '',
            },
          },
        },
        {
          field: 'version',
          title: '版本',
          span: 24,
          itemRender: {
            name: '$input',
            props: {
              placeholder: '',
            },
          },
          slots: {
            default: 'formItem2',
          },
        },
      ],
      getData: getList,
    },
    main: {
      columns: [
        {
          field: 'bom.version',
          title: 'BOM版本',
          minWidth: '100',
        },
        {
          field: 'bom.name',
          title: '物料名称',
          minWidth: '100',
        },
        {
          field: 'bom.shortName',
          title: 'BOM简称',
          minWidth: '100',
        },
        {
          field: 'bom.category',
          title: 'BOM分类',
          minWidth: '100',
        },
        {
          field: 'bom.code',
          title: '物料编码',
          minWidth: '100',
        },
        {
          field: 'bom.property',
          title: '属性',
          minWidth: '100',
        },
        {
          field: 'bom.specific',
          title: '规格型号',
          minWidth: '100',
        },
        {
          field: 'bom.remark',
          title: '描述',
          minWidth: '100',
        },
      ],
      operate: {
        button: ['view'],
      },
    },
    category: {
      title: '物料分组',
      columns: [
        {
          field: 'showName',
          className: 'cellHover',
          treeNode: true,
        },
      ],
      getData: getMtCategorys,
      categoryParamsConfig: ['groupName', 'code'],
    },
  }
}
async function config2() {
  return {
    search: {
      fields: {
        unitUnionCode: '',
        code: '',
        name: '',
        property: '',
        groupName: '',
        psnDesc: '',
        version: '',
        haveLastBomVersion: true,
        haveChild: true,
      },
      items: [
        {
          span: 24,
          children: [
            {
              field: 'code',
              title: '物料编码',
              span: 24,
              itemRender: {
                name: '$input',
                props: {
                  placeholder: '',
                },
              },
              slots: {
                default: 'formItem1',
              },
            },
            // {
            //   field: 'property',
            //   title: ('物料属性'),
            //   span: 24,
            //   itemRender: {
            //     name: '$select',
            //     options: await dictsOption('MATERIAL_PROPERTY'),
            //     props: {
            //       placeholder: '',
            //     },
            //   },
            // },
            // {
            //   field: 'name',
            //   title: ('物料名称'),
            //   span: 24,
            //   itemRender: {
            //     name: '$input',
            //     props: {
            //       placeholder: '',
            //     },
            //   },
            // },
            // {
            //   field: 'groupName',
            //   title: ('物料类别'),
            //   span: 24,
            //   itemRender: {
            //     name: '$select',
            //     options: [],
            //     props: {
            //       placeholder: '',
            //     },
            //   },
            // },
            // {
            //   field: 'psnDesc',
            //   title: ('规格型号'),
            //   span: 24,
            //   itemRender: {
            //     name: '$input',
            //     props: {
            //       placeholder: '',
            //     },
            //   },
            // },
            {
              field: 'version',
              title: 'BOM版本',
              span: 24,
              itemRender: {
                name: '$input',
                props: {
                  placeholder: '',
                },
              },
              slots: {
                default: 'formItem2',
              },
            },
          ],
        },
      ],
      getData: getSubDetail,
    },
    main: {
      columns: [
        {
          field: 'id',
          title: 'BOM层级',
          minWidth: 80,
          treeNode: true,
        },
        {
          field: 'code',
          title: '子项物料编码',
          minWidth: 100,
        },
        {
          field: 'name',
          title: '物料名称',
          minWidth: 100,
        },
        {
          field: 'specific',
          title: '规格型号',
          minWidth: 100,
        },
        {
          field: 'property',
          title: '物料属性',
          minWidth: 100,
        },
        {
          field: 'version',
          title: 'BOM版本',
          minWidth: 100,
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 100,
        },
        {
          field: 'numberUsage',
          title: '用量:分子',
          minWidth: 100,
        },
        {
          field: 'denom',
          title: '用量:分母',
          minWidth: 100,
        },
        {
          field: 'usageType',
          title: '用量类型',
          minWidth: 100,
        },
        {
          field: 'fixedLoss',
          title: '固定损耗',
          minWidth: 100,
        },
        {
          field: 'lossRate',
          title: '变动损耗率',
          minWidth: 100,
        },
        // {
        //   field: 'creater',
        //   title: ('创建人'),
        //   minWidth: 100,
        // },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 100,
        },
        // {
        //   field: 'updater',
        //   title: ('更新人'),
        //   minWidth: 100,
        // },
        {
          field: 'updateTime',
          title: '更新时间',
          minWidth: 100,
        },
      ],
    },
    expand: {
      columns: [
        {
          field: 'id',
          title: 'BOM层级',
          minWidth: 80,
          treeNode: true,
        },
        {
          field: 'code',
          title: '子项物料编码',
          minWidth: 100,
        },
        {
          field: 'name',
          title: '物料名称',
          minWidth: 100,
        },
        {
          field: 'specific',
          title: '规格型号',
          minWidth: 100,
        },
        {
          field: 'property',
          title: '物料属性',
          minWidth: 100,
        },
        {
          field: 'version',
          title: 'BOM版本',
          minWidth: 100,
        },
        {
          field: 'unit',
          title: '单位',
          minWidth: 100,
        },
        {
          field: 'numberUsage',
          title: '用量:分子',
          minWidth: 100,
        },
        {
          field: 'denom',
          title: '用量:分母',
          minWidth: 100,
        },
        {
          field: 'usageType',
          title: '用量类型',
          minWidth: 100,
        },
        {
          field: 'fixedLoss',
          title: '固定损耗',
          minWidth: 100,
        },
        {
          field: 'lossRate',
          title: '变动损耗率',
          minWidth: 100,
        },
        {
          field: 'creater',
          title: '创建人',
          minWidth: 100,
        },
        {
          field: 'createTime',
          title: '创建时间',
          minWidth: 100,
        },
        {
          field: 'updater',
          title: '更新人',
          minWidth: 100,
        },
        {
          field: 'updateTime',
          title: '更新时间',
          minWidth: 100,
        },
      ],
    },
    category: {
      title: '物料分组',
      columns: [
        {
          field: 'showName',
          className: 'cellHover',
          treeNode: true,
        },
      ],
      getData: getMtCategorys,
      categoryParamsConfig: ['groupName', 'code'],
    },
  }
}

export const detailFormItem = [
  {
    field: 'code',
    title: '父项物料编码',
    span: 8,
  },
  {
    field: 'name',
    title: '物料名称',
    span: 8,
  },
  {
    field: 'version',
    title: 'BOM版本',
    span: 8,
  },
  {
    field: 'property',
    title: '物料属性',
    span: 8,
  },
  {
    field: 'specific',
    title: '规格型号',
    span: 8,
  },
  {
    field: 'unit',
    title: '父项物料单位',
    span: 8,
  },
  {
    field: 'formula',
    title: '配方',
    span: 8,
  },
  {
    field: 'remark',
    title: '描述',
    span: 16,
  },
]

export const detailTab1 = {
  search: {
    fields: {
      unitUnionCode: '',
    },
    getData: getSubDetail,
    enable: false,
  },
  main: {
    columns: [
      ...common,
      {
        field: 'bom.lossRate',
        title: '变动损耗率',
        minWidth: '100',
      },
    ],
  },
  settings: {
    titleVisable: false,
  },
}
export const detailTab2 = {
  search: {
    fields: {
      unitUnionCode: '',
    },
    getData: getSubStep,
    enable: false,
  },
  main: {
    columns: [
      ...common,
      {
        field: 'bom.startQuantity',
        title: '起始数量',
        minWidth: '100',
      },
      {
        field: 'bom.endQuantity',
        title: '截止数量',
        minWidth: '100',
      },
      {
        field: 'bom.lossRate',
        title: '变动损耗率',
        minWidth: '100',
      },
    ],
  },
  settings: {
    titleVisable: false,
  },
}

export default {
  $bom$index: config,
  $bom$view: config2,
}
