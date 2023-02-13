import request from './baseRequest'

//获取点巡检计划列表
export const getPreventMaintainPlanList = async (
  {
    pageNum,
    pageSize,
    isEnabled,
    planCode,
    planName,
    planNameAndCode,
    planType,
    startTime,
    actionUser,
    endTime,
    // factoryId,
    // workSpaceId,
    // productionLineId,
    departId,
    conveyorId,
  },
  data
) => {
  let str = ''
  if (typeof isEnabled == 'boolean') {
    str += isEnabled ? `&isEnabled=true` : `&isEnabled=false`
  }
  str += actionUser ? `&actionUser=${actionUser}` : ''
  str += planNameAndCode ? `&planNameAndCode=${planNameAndCode}` : ''
  /* str += planCode?`&planCode=${planCode}`:'';
    str += planName?`&planName=${planName}`:''; */
  str += planType ? `&planType=${planType}` : ''
  str += startTime ? `&startTime=${startTime}` : ''
  str += endTime ? `&endTime=${endTime}` : ''
  // str += factoryId ? `&factoryId=${factoryId}` : ''
  // str += workSpaceId ? `&workSpaceId=${workSpaceId}` : ''
  // str += productionLineId ? `&productionLineId=${productionLineId}` : ''
  str += departId ? `&departId=${departId}` : ''
  str += conveyorId ? `&endTime=${conveyorId}` : ''
  return request.get(
    `/preventmaintain/page?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}

//新建计划
export const createNewPreventmaintainPlan = (data) =>
  request.post('/preventmaintain/save', data)

//更新计划
export const updatePreventmaintainPlan = (data) =>
  request.post('/preventmaintain/update', data)

//删除计划
export const deletePreventmaintainPlan = ({ id }, data) =>
  request.post(`/preventmaintain/delete?id=${id}`, data)

//获取计划详情
export const getPreventmaintainPlanInfoById = ({ id }, data) =>
  request.get(`/preventmaintain/info?id=${id}`, data)

//更改计划执行状态
export const changePreventmaintainPlanActionStatus = ({ id, status }) =>
  request.post(`/preventmaintain/updateStatus?id=${id}&status=${status}`)
