import request from './baseRequest'

//执行统计数据
export const getDashActingData = async ({
  beginTime,
  endTime,
  taskType,
  pageSize,
  pageNum,
}) =>
  request.get(
    `/dash/acting?beginTime=${beginTime}&endTime=${endTime}&taskType=${taskType}&pageSize=${pageSize}&pageNum=${pageNum}`
  )
