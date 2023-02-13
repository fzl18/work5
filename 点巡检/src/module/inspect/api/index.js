import request from './baseRequest'

//首页获取所有工单统计数据
export const getStatisticsWorkOrderData = () =>
  request.get('/workOrder/statisticsWorkOrder')

//首页巡检 点检数据
export const getIndexPollingData = async ({ dateType, pollingType }) =>
  request.get(
    `/indexdata/polling?dateType=${dateType}&pollingType=${pollingType}`
  )

//获取下拉枚举
export const getSelectEnums = (data) => request.get('/main/getCheckEnums', data)

//首页输送线故障统计
export const getIndexLineData = async ({ dateType, pollingType }) =>
  request.get(`/indexdata/line?dateType=${dateType}&pollingType=${pollingType}`)
