import request from './baseRequest'

//输送线table数据
export const getDashLineTrendTableData = async ({
  beginTime,
  endTime,
  taskType,
  pageSize,
  pageNum,
}) =>
  request.get(
    `/dash/lineTrend?beginTime=${beginTime}&endTime=${endTime}&taskType=${taskType}&pageSize=${pageSize}&pageNum=${pageNum}`
  )

//输送线echarts数据
export const getDashLineTrendEchartsData = async ({
  beginTime,
  endTime,
  taskType,
}) =>
  request.get(
    `/dash/lineTrend/echart?beginTime=${beginTime}&endTime=${endTime}&taskType=${taskType}`
  )
