import request from './baseRequest'

//factory
//获取工厂列表
export const getFactoryListPage = ({ pageSize, pageNum, factoryName = '' }) => {
  let str = factoryName ? `&factoryName=${factoryName}` : ''
  return request.get(
    `/factory/page?pageSize=${pageSize}&pageNum=${pageNum}${str}`
  )
}

export const getFactoryList = () => {
  return request.get(`/factory/listFactory`)
}

//创建新工厂
export const createNewFactory = (data) => request.post('/factory/save', data)

//工厂信息更新
export const updateFactoryInfo = (data) => request.post('/factory/update', data)

//删除厂区
export const deleteFactory = (data) => request.post('/factory/delete', data)
