import request from './baseRequest'

//获取异常设备列表
export const getAbnormalEquip = async ({
  pageNum,
  pageSize,
  equipmentTypeId,
  // factoryId,
  // productionLineId,
  taskType,
  // workSpaceId,
  departId,
  conveyorId,
}) => {
  let str = ''
  str += equipmentTypeId ? `&equipmentTypeId=${equipmentTypeId}` : ''
  // str += factoryId ? `&factoryId=${factoryId}` : ''
  // str += productionLineId ? `&productionLineId=${productionLineId}` : ''
  str += taskType ? `&taskType=${taskType}` : ''
  // str += workSpaceId ? `&workSpaceId=${workSpaceId}` : ''
  str += departId ? `&departId=${departId}` : ''
  str += conveyorId ? `&conveyorId=${conveyorId}` : ''
  return request.get(
    `/polling/abnormal/pageAbnormalEquip?pageNum=${pageNum}&pageSize=${pageSize}${str}`
  )
}

//获取巡检信息
export const getPollingTaskInfo = ({ taskId }) =>
  request.get(`/polling/task/getPollingTask?id=${taskId}`)
