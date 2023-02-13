import request from './baseRequest'

//车间管理
//新增车间
export const createNewWorkSpace = (data) =>
  request.post('/factory/saveWorkSpace', data)

//获取车间列表
export const getWorkSpacePage = async ({
  factoryId,
  name,
  pageNum = 1,
  pageSize = 10,
}) => {
  let str = name ? `&name=${name}` : ''
  str += factoryId ? `&factoryId=${factoryId}` : ''
  return request.get(
    `/factory/pageWorkSpace?pageNum=${pageNum}&pageSize=${pageSize}${str}`
  )
}

//更新车间信息
export const updateWorkSpace = (data) =>
  request.post('/factory/updateWorkSpace', data)

//删除车间
export const deleteWorkSpace = (data) =>
  request.post('/factory/deleteWorkSpace', data)
