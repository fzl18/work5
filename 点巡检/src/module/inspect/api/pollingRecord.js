import request from './baseRequest'

//获取巡检记录
export const getPollingTaskList = async ({
  pageNum,
  pageSize,
  // equipmentId,
  // adaptId,
  // factoryId,
  deviceId,
  departId,
  pollingPlanId,
  taskNameLike,
  taskStatus,
  taskType,
  actionUserNameLike,
  startCreatedTime,
  endCreatedTime,
  isAbnormal,
}) => {
  let str = ''
  if (typeof isAbnormal == 'boolean') {
    str += isAbnormal ? `&isAbnormal=true` : `&isAbnormal=false`
  }
  str += actionUserNameLike ? `&actionUserNameLike=${actionUserNameLike}` : ''
  str += startCreatedTime ? `&startCreatedTime=${startCreatedTime}` : ''
  str += endCreatedTime ? `&endCreatedTime=${endCreatedTime}` : ''
  // str += equipmentId ? `&equipmentId=${equipmentId}` : ''
  // str += adaptId ? `&adaptId=${adaptId}` : ''
  // str += factoryId ? `&factoryId=${factoryId}` : ''
  str += deviceId ? `&deviceId=${deviceId}` : ''
  str += departId ? `&departId=${departId}` : ''
  str += pollingPlanId ? `&pollingPlanId=${pollingPlanId}` : ''
  str += taskNameLike ? `&taskNameLike=${taskNameLike}` : ''
  str += taskStatus ? `&taskStatus=${taskStatus}` : ''
  str += taskType ? `&taskType=${taskType}` : ''
  return request.get(
    `/polling/task/pagePollingTask?pageNum=${pageNum}&pageSize=${pageSize}${str}`
  )
}

//根据计划id获取巡检记录
export const getPollingRecordsByPlanId = ({ id, pageNum, pageSize }) =>
  request.get(
    `/polling/task/pagePollingTask?pollingPlanId=${id}&pageNum=${pageNum}&pageSize=${pageSize}`
  )

//根据任务id获取巡检记录详情
export const getPollingDetailById = ({ id }) =>
  request.get(`/polling/task/getPollingTask?id=${id}`)

//根据设备id获取内容
export const getPollingDeviceContentById = ({ id }) =>
  request.post(`/polling/task/listTaskContent?id=${id}`)

//获取巡检轨迹by任务id
export const getPollingTrace = async ({ taskId }) =>
  request.get(`/polling/task/pollingTrack?id=${taskId}`)

//获取巡检实时轨迹by任务id
export const getPollingCurTrace = async ({ taskId }) =>
  request.get(`/polling/track/list?id=${taskId}`)
