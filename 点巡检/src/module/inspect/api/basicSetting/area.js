import request from '../../request'

const http = request('/ledger')
// Old
const http2 = request('/storage')
const http3 = request('/framework')
// Tree
export const listAreaTree = () => {
  return http.get('/area/getAreaTree', { params: {} })
}

// Detail
export const detailedAreaInfo = (params) => {
  return http.get('/area/getAreaInfoById', { params })
}

// Save [ BaseInfo ]
export const saveArea = (data) => {
  return http.post('/area/areaSave', data)
}

// Update []
export const updateArea = (data) => {
  return http.put('/area/areaUpdate', data)
}

// Delete Area
export const deleteArea = (params) => {
  return http.delete('/area/areaDelete', { params })
}

// Save [Group]
export const saveGroup = (data) => {
  return http.post('/area/addAreaTeam', data)
}

// Update [Group]
export const updateGroup = (data) => {
  return http.put('/area/updateAreaTeam', data)
}

// Delete [Group]
export const deleteGroupByAreaId = (params) => {
  return http.delete('/area/delAreaTeam', { params })
}

// Store
export const listStoreByFilters = () => {
  return http2.get('/storagestoreinfo/pullStoreInfo', {})
}

// Org
export const listOrganizationByFilters = (topUnit) => {
  return http3.get(`/system/platform/allunits/${ topUnit }`)
}
