import request from './baseRequest'

//租户
//获取租户列表
export const getTenantList = ({
  industryType,
  nameLike,
  pageNum,
  pageSize,
}) => {
  let str = ''
  str += nameLike ? `&nameLike=${nameLike}` : ''
  str += industryType ? `&industryType=${industryType}` : ''
  return request.get(
    `/tenant/pageTenant?pageNum=${pageNum}&pageSize=${pageSize}${str}`
  )
}

//查询租户信息
export const getTenantInfoById = async ({ id }) =>
  request.get(`/tenant/getTenant?tenantId=${id}`)

//新建租户
export const createTenant = (data) => request.post('/tenant/saveTenant', data)

//删除租户
export const deleteTenant = ({ tenantId }) =>
  request.post(`/tenant/removeTenant?tenantId=${tenantId}`)

//更新租户
export const updateTenant = (data) => request.post('/tenant/updateTenant', data)

//租户已开通产品列表
export const getTenantOpenPrdList = ({ tenantId }) =>
  request.get(`/tenant/listTenantOpenBizProduct?tenantId=${tenantId}`)

//租户未开通产品列表
export const getTenantNotOpenPrdList = ({ tenantId }) =>
  request.get(`/tenant/listTenantBizProduct?tenantId=${tenantId}`)

//开通租户产品
export const openTenantPrd = async (data) =>
  request.post('/tenant/openTenantBizProduct', data)
