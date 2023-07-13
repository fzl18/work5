import fetch from '@/utils/request'
let request = fetch()
import { $translateTitle } from '@/utils/i18n'

export function getProductTypeList(data) {
  return request({
    url: '/mt/categorys',
    method: 'POST',
    data,
  })
}

function dicts(data) {
  return request({
    url: '/index/dicts',
    method: 'POST',
    data: { dictCategory: data },
  })
}
const List = ['exemptCheck', 'enableBatch', 'enableSupple']
const getTypeOptions = async () => {
  let data = await getProductTypeList({
    unitUnionCode: this.queryForm.unitUnionCode,
  })
  let typeOptions = []
  if (Array.isArray(data)) {
    formatTree(data)
    typeOptions = data
  } else {
    typeOptions = []
  }
  return typeOptions
  function formatTree(data) {
    data.forEach((item) => {
      item.value = item.code
      item.label = item.name
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        formatTree(item.children)
      } else {
        delete item.children
      }
    })
  }
}

export async function dictsOption(type) {
  const data = (await dicts(type)) || []
  if (data && data.length) {
    data.map((item) => {
      item.label = item.dictName
      item.value = item.dictCode
    })
  }
  return data
}

export const booleanNumberOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
]
export const booleanOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
]

export const dataObjFormat = (val, fix) => {
  if (typeof val === 'string') {
    val = val.trim()
  }
  if (val === '' || val === null) {
    val = '-'
  }
  if ((val === false || val === 0) && fix) {
    val = $translateTitle('否')
  }
  if ((val === true || val === 1) && fix) {
    val = $translateTitle('是')
  }
  if ((val === true || val === -1) && fix) {
    val = $translateTitle('--')
  }
  return val
}

export const ObjFormat = (data) => {
  let keys = Object.keys(data)
  data.$oldData = {}
  keys.map((val) => {
    data.$oldData[val] = data[val]
    if (List.includes(val)) {
      data[val] = dataObjFormat(data[val], true)
    } else {
      data[val] = dataObjFormat(data[val])
    }
  })
  return data
}

export const dataArrayFormat = (val) => {
  val.map((item) => {
    let keys = Object.keys(item)
    item.$oldData = {}
    keys.map((val) => {
      item.$oldData[val] = item[val]
      if (List.includes(val)) {
        item[val] = dataObjFormat(item[val], true)
      } else {
        item[val] = dataObjFormat(item[val])
      }
    })
  })
  return val
}

export default {}
