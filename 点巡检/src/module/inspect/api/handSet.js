import request from './baseRequest'

//手持终端
//获取终端列表
export const getTerminalList = ({ pageNum, pageSize }, data) =>
  request.get(`/terminal/list?pageNum=${pageNum}&pageSize=${pageSize}`, data)

//增加终端
export const addTerminal = (data) => request.post('/terminal/save', data)

//更新终端信息
export const terminalUpdate = (data) => request.post('/terminal/update', data)

//删除终端设备
export const deleteTerminal = ({ id }, data) =>
  request.post(`/terminal/delete?id=${id}`, data)

export const getFactoryListPage = (
  { pageSize, pageNum, factoryName = '' },
  data
) => {
  let str = factoryName ? `&factoryName=${factoryName}` : ''
  return request.get(
    `/factory/page?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}
