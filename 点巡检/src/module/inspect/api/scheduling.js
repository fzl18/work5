import request from './baseRequest'

//排班
//获取排班列表
export const getListScheduling = ({ pageSize, pageNum, titleLike }, data) => {
  let str = titleLike ? `&titleLike=${titleLike}` : ''
  return request.get(
    `/scheduling/listScheduling?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}

//删除排班
export const deleteScheduling = ({ id }, data) =>
  request.post(`/scheduling/removeScheduling?id=${id}`, data)

//根据id获取排班信息
export const getSchedulingDetail = ({ id }, data) =>
  request.get(`/scheduling/listSchedulingDetail?id=${id}`, data)
