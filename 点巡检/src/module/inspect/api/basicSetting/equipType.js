import request from '../../request'

const http = request('/ledger')
const http4 = request('/monitor/monitor')
// Tree
export const listEquipTypeTree = () => {
  return http.get('/equipmentKind/getEquipmentKindTree', { params: {} })
}

// Detail
export const detailedEquipTypeInfo = (params) => {
  return http.get('/equipmentKind/getEquipmentKindInfoById', { params })
}

// Attrs Options

export const listAttrsList = ({ params }) => {
  return http.get('/attr/list', { params: params })
}

// Set Attrs
export const setEquipAttrs = (data) => {
  return http.put('/equipmentKind/setEquipmentKindAttrs', data)
}

// Set Graphs
export const setEquipTypeGraphs = (data) => {
  return http.put('/equipmentKind/setEquipmentKindGraphs', data)
}

// Set structs
export const setEquipTypeStructs = (data) => {
  return http.put('/equipmentKind/setEquipmentKindStructure', data)
}

// Save
export const saveEquipType = (data) => {
  return http.post('/equipmentKind/equipmentKindSave', data)
}

// Update
export const updateEquipType = (data) => {
  return http.put('/equipmentKind/equipmentKindUpdate', data)
}

// Delete
export const deleteEquipTypeById = (params) => {
  return http.delete('/equipmentKind/equipmentKindDelete', { params })
}
