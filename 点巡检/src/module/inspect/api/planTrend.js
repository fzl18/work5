import request from './baseRequest'

//数据看板
//执行趋势table数据
export const getDashTrendTableData = async ({
  beginTime,
  endTime,
  taskType,
  pageSize,
  pageNum,
}) =>
  request.get(
    `/dash/trend?beginTime=${beginTime}&endTime=${endTime}&taskType=${taskType}&pageSize=${pageSize}&pageNum=${pageNum}`
  )

//执行趋势echarts数据
export const getDashTrendEchartsData = async ({
  beginTime,
  endTime,
  taskType,
}) =>
  request.get(
    `/dash/trend/echart?beginTime=${beginTime}&endTime=${endTime}&taskType=${taskType}`
  )
