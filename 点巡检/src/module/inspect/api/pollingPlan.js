import request from './baseRequest'

//获取点巡检计划列表
export const getPollingPlanList = async (
  {
    pageNum,
    pageSize,
    isEnabled,
    planNameAndCode,
    planType,
  },
  data
) => {
  let str = ''
  if (typeof isEnabled == 'boolean') {
    str += isEnabled ? `&isEnabled=true` : `&isEnabled=false`
  }
  str += planNameAndCode ? `&planNameAndCode=${ planNameAndCode }` : ''
  str += planType ? `&planType=${ planType }` : ''
  return request.get(
    `/polling/page?pageSize=${ pageSize }&pageNum=${ pageNum }${ str }`,
    data
  )
}

//新建计划
export const createNewPollingPlan = (data) =>
  request.post('/polling/save', data)

//验证计划名称
export const checkPlanName = async ({ planName, planId }, data) => {
  let str = ''
  str += planId ? `&planId=${ planId }` : ''
  return request.get(`/polling/checkName?planName=${ planName }${ str }`, data)
}

//更新计划
export const updatePollingPlan = (data) => request.post('/polling/update', data)

//删除计划
export const deletePollingPlan = ({ id }, data) =>
  request.post(`/polling/delete?id=${ id }`, data)

//获取计划详情
export const getPlanInfoById = ({ id }, data) =>
  request.get(`/polling/info?id=${ id }`, data)

//更改计划执行状态
export const changePlanActionStatus = ({ id, status }) =>
  request.post(`/polling/updateStatus?id=${ id }&status=${ status }`)

export const savePollingPlan = (data) => {
  return request.post('/polling/save', data)
}
