import request from './baseRequest'

//获取巡检标准列表
export const getStandardList = (
  {
    pageNum,
    pageSize,
    standardName,
    standardType,
    equipmentTypeId,
    endIneffectiveTime,
  },
  data
) => {
  let str = ''
  str += standardName ? `&standardName=${standardName}` : ''
  str += standardType ? `&standardType=${standardType}` : ''
  str += equipmentTypeId ? `&equipmentTypeId=${equipmentTypeId}` : ''
  str += endIneffectiveTime ? `&endIneffectiveTime=${endIneffectiveTime}` : ''
  return request.get(
    `/polling/standard/page?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}

//新增巡检标准
export const createNewPollingStandard = (data) =>
  request.post('/polling/standard/save', data)

//删除巡检标准
export const deletePollingStandardById = ({ id }, data) =>
  request.post(`/polling/standard/delete?id=${id}`, data)

//查询巡检标准
export const getPollingStandardById = ({ id }, data) =>
  request.post(`/polling/standard/get?id=${id}`, data)

//更新巡检标准
export const updatePollingStandard = (data) =>
  request.post(`/polling/standard/update`, data)
