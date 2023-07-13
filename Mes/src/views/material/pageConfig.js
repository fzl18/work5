import { getMtCategorys, getMtList, updateMt } from './api'
import {
  booleanOptions,
  booleanNumberOptions,
  dictsOption,
} from '@/views/dictionaryApi.js'

export async function config() {
  return {
    search: {
      fields: {
        unitUnionCode: '',
        code: '',
        mtype: '',
        mproperty: '',
        mspecific: '',
        exemptCheck: '',
      },
      items: [
        {
          span: 24,
          children: [
            {
              field: 'materialName',
              title: '物料编码/物料名称',
              span: 24,
              itemRender: {
                name: '$input',
                props: {
                  placeholder: '',
                },
              },
            },
            {
              field: 'mtype',
              title: '物料类型',
              span: 24,
              itemRender: {
                name: '$select',
                props: {
                  placeholder: '',
                },
                options: await dictsOption('MATERIAL_TYPE'),
              },
            },
            {
              field: 'mproperty',
              title: '物料属性',
              span: 24,
              itemRender: {
                name: '$select',
                props: {
                  placeholder: '',
                },
                options: await dictsOption('MATERIAL_PROPERTY'),
              },
            },
            {
              field: 'mspecific',
              title: '物料型号',
              span: 24,
              itemRender: {
                name: '$input',
                props: {
                  placeholder: '',
                },
              },
            },
            {
              field: 'exemptCheck',
              title: '是否免检',
              span: 24,
              itemRender: {
                name: '$select',
                options: [
                  ...booleanNumberOptions,
                  {
                    label: '--',
                    value: -1,
                  },
                ],
                props: {
                  placeholder: '',
                },
              },
            },
          ],
        },
      ],
      getData: getMtList,
    },
    main: {
      columns: [
        {
          field: 'code',
          title: '物料编码',
        },
        {
          field: 'name',
          title: '物料名称',
        },
        {
          field: 'specific',
          title: '规格型号',
        },
        {
          field: 'propertyLocalVal',
          title: '物料属性',
        },
        {
          field: 'typeName',
          title: '物料类型',
        },
        {
          field: 'groupName',
          title: '物料分类',
        },
        {
          field: 'inventoryUnit',
          title: '基本单位',
        },
        {
          field: 'enableBatch',
          title: '启用批次',
        },
        {
          field: 'enableSupple',
          title: '启用辅助',
        },
      ],
      operate: {
        button: ['view', 'edit'],
      },
    },
    category: {
      title: '分类',
      columns: [
        {
          field: 'showName',
          className: 'cellHover',
          treeNode: true,
        },
      ],
      getData: getMtCategorys,
    },
  }
}

export default {
  $material$index: config,
}
export const detail = {
  items: [
    {
      field: 'code',
      title: '物料编码',
      span: 12,
    },
    {
      field: 'safeInventory',
      title: '安全库存',
      span: 12,
    },
    { field: 'name', title: '物料名称', span: 12 },
    { field: 'maxInventory', title: '最大库存', span: 12 },
    { field: 'specific', title: '规格型号', span: 24 },
    { field: 'exemptCheck', title: '是否免检', span: 12 },
    { field: 'propertyLocalVal', title: '物料属性', span: 12 },
    {
      field: 'inOverProportion',
      title: '入库超产比例',
      span: 12,
    },
    {
      field: 'inventoryUnit',
      title: '库存单位编码',
      span: 12,
    },
    { field: 'outExceed', title: '是否超发', span: 12 },
    { field: 'suppleUnit', title: '辅助单位编码', span: 12 },
    { field: 'enableBatch', title: '启用批次', span: 12 },
    { field: 'enableSupple', title: '启用辅助', span: 12 },
    { field: 'shelfLife', title: '保质天数', span: 12 },
    { field: 'minInventory', title: '最少库存', span: 12 },
    {
      align: 'center',
      span: 24,
      collapseNode: true,
    },
    {
      field: 'createBy',
      title: '创建人',
      span: 12,
      folding: true,
    },
    {
      field: 'createTime',
      title: '创建时间',
      span: 12,
      folding: true,
    },
    {
      field: 'updateBy',
      title: '更新人',
      span: 12,
      folding: true,
    },
    {
      field: 'updateTime',
      title: '更新时间',
      span: 12,
      folding: true,
    },
  ],
}
export const edit = {
  items: [
    {
      field: 'code',
      title: '物料编码',
      span: 24,
    },
    { field: 'name', title: '物料名称', span: 24 },
    {
      field: 'outExceed',
      title: '是否超发',
      span: 12,
      itemRender: { name: '$select', options: booleanOptions },
    },
    {
      field: 'exemptCheck',
      title: '是否免检',
      span: 12,
      itemRender: { name: '$select', options: booleanNumberOptions },
    },
    {
      field: 'remark',
      title: '备注',
      span: 24,
      itemRender: { name: '$textarea' },
    },
    {
      align: 'center',
      span: 24,
      itemRender: {
        name: '$buttons',
        children: [
          { props: { type: 'submit', content: '提交', status: 'primary' } },
          { props: { type: 'reset', content: '重置' } },
        ],
      },
    },
  ],
  submit: updateMt,
}
