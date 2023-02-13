import request from './baseRequest'

//工单
//获取工单列表
export const getWorkorderList = async (
  {
    pageNum,
    pageSize,
    startCreatedTime,
    endCreatedTime,
    // factoryDistrictId,
    departId,
    workorderName,
    workorderNo,
    workorderType,
    workorderStatus,
    overtimeType,
    // equipmentId,
    // adaptId,
    // prodLineId,
    deviceId,
    conveyorId,
    pmPlanId,
  },
  data
) => {
  let str = ''
  // str += equipmentId ? `&equipmentId=${equipmentId}` : ''
  // str += adaptId ? `&adaptId=${adaptId}` : ''
  // str += factoryDistrictId ? `&factoryDistrictId=${factoryDistrictId}` : ''
  str += departId ? `&departId=${departId}` : ''
  str += conveyorId ? `&conveyorId=${conveyorId}` : ''
  str += deviceId ? `&deviceId=${deviceId}` : ''
  str += workorderName ? `&workorderName=${workorderName}` : ''
  str += workorderNo ? `&workorderNo=${workorderNo}` : ''
  str += workorderType ? `&workorderType=${workorderType}` : ''
  str += workorderStatus ? `&workorderStatus=${workorderStatus}` : ''
  str += overtimeType ? `&overtimeType=${overtimeType}` : ''
  str += startCreatedTime ? `&startCreatedTime=${startCreatedTime}` : ''
  str += endCreatedTime ? `&endCreatedTime=${endCreatedTime}` : ''
  // str += prodLineId ? `&prodLineId=${prodLineId}` : ''
  str += pmPlanId ? `&pmPlanId=${pmPlanId}` : ''
  return request.get(
    `/workOrder/pageWorkOrder?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}

//根据id查询工单数据
export const getWorkOrderById = ({ id }, data) =>
  request.get(`/workOrder/getWorkOrder?id=${id}`, data)

//新建工单
export const createNewWorkOrder = (data) =>
  request.post('/workOrder/saveWorkOrder', data)

//更新工单
export const updateWorkOrder = (data) =>
  request.post('/workOrder/updateWorkOrder', data)

//获取工单记录
export const getWorkOrderRecord = ({ id }) =>
  request.get(`/workOrder/getWorkOrderFlow?id=${id}`)

//删除工单
export const deleteWorkOrderById = ({ id }, data) =>
  request.post(`/workOrder/removeWorkOrder?id=${id}`, data)

//工单审批
export const approveWorkOrder = (data) =>
  request.post('/workOrder/approveWorkOrder', data)

//工单验收
export const checkWorkOrder = (data) =>
  request.post('/workOrder/checkWorkOrder', data)

//评价工单
export const appraiseWorkOrder = (data) =>
  request.post('/workOrder/appraiseWorkOrder', data)

//根据工单id查询配件记录
export const getPartsRecordByWorkOrderId = ({ id }) =>
  request.get(`/workOrder/listWorkOrderDevice?workorderId=${id}`)

//获取工单实时轨迹by任务id
export const getWorkOrderCurTrace = async ({ id }) =>
  request.get(`/workOrder/track/list?id=${id}`)
