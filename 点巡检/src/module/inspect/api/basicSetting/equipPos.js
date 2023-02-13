import request from '../../request'

const http = request('/ledger')
// Old
const http2 = request('/am-app-api-web')
const http3 = request('/base')
// Tree
export const listEquipTree = () => {
  return http.get('/equipment/getEquipmentTree', { params: {} })
}

// Detail
export const detailedEquipInfo = (params) => {
  return http.get('/equipment/getEquipmentInfoById', { params })
}

// Save [ BaseInfo ]
export const saveEquip = (data) => {
  return http.post('/equipment/equipmentSave', data)
}

// Update []
export const updateEquip = (data) => {
  return http.put('/equipment/equipmentUpdate', data)
}

// Delete Equip
export const deleteEquip = (params) => {
  return http.delete('/equipment/equipmentDelete', { params })
}

// Set attrs
///equipment/setEquipmentInstanceAttrs
export const setEquipInsAttrs = (data) => {
  return http.put('/equipment/setEquipmentInstanceAttrs', data)
}

// Set graphs
export const setEquipInsGraphs = (data) => {
  return http.put('/equipment/setEquipmentInstanceGraphs', data)
}

// Get Base DATA
export const listBaseData = (params) => {
  return http2.get('option/get', { params })
}

//
export const listEquipManaPoints = (params) => {
  return http.get('/equipment/getManagementPointList', { params })
}

export const listMaterialItems = (data) => {
  return http3.post('/materialmaterialinfo/page', data, { params: { current: 1, size: 1000 } })
}

// 设备列表
export const listEquip = (params) => {
  return http.get('/equipment/getEquipmentList', { params })
}

// 主设备列表(输送机)
export const listMainEquip = (params) => {
  return http.get('/equipment/getMainEquipmentList', { params })
}
