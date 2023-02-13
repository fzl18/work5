import request from './baseRequest'

//用户操作日志
//获取业务类型
export const getAllModule = (data) => request.get('/log/getModule', data)

//获取日志
export const getOperationLogs = (
  { actionModule, createdTime, name, pageNum, pageSize },
  data
) => {
  let str = ''
  str += actionModule ? `actionModule=${actionModule}&` : ''
  str += createdTime ? `createdTime=${createdTime}&` : ''
  str += name ? `name=${name}&` : ''
  str += pageNum ? `pageNum=${pageNum}&` : ''
  str += pageSize ? `pageSize=${pageSize}` : ''
  return request.get(`/log/page?${str}`, data)
}
