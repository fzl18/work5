import request from './baseRequest'

export const getDevicesList = async ({ pageNum, pageSize }) =>
  request.get(`/equipment/page?pageNum=${pageNum}&pageSize=${pageSize}`)

//设备查询备件记录
export const getDeviceChangePartsRecord = async ({
                                                   // adaptId,
                                                   deviceId,
                                                   pageNum,
                                                   pageSize,
                                                 }) => {
  return request.get(
    `/workOrder/pageWorkOrderDevice?pageSize=${pageSize}&pageNum=${pageNum}&deviceId=${deviceId}`
  )
}

//查询坑位设备操作历史记录
export const getAdaptHistoryPageList = async ({
                                                adaptId,
                                                pageNum,
                                                pageSize,
                                              }) => {
  return request.get(
    `/adapt/historyPage?pageSize=${pageSize}&pageNum=${pageNum}&adaptId=${adaptId}`
  )
}

// 获取坑位分页信息
export const getAdaptPageList = async (
  {
    pageNum,
    pageSize,
    factoryId,
    workSpaceId,
    productionLineId,
    coverybeltId,
    adaptId,
    formCode,
    materialName,
    materialObjectCode,
    isAll,
    systemCode,
  },
  data
) => {
  let str = ''
  str += factoryId ? `&factoryId=${factoryId}` : ''
  str += workSpaceId ? `&workSpaceId=${workSpaceId}` : ''
  str += productionLineId ? `&productionLineId=${productionLineId}` : ''
  str += coverybeltId ? `&coverybeltId=${coverybeltId}` : ''
  str += adaptId ? `&adaptId=${adaptId}` : ''
  str += formCode ? `&formCode=${formCode}` : ''
  str += materialName ? `&materialName=${materialName}` : ''
  str += materialObjectCode ? `&materialObjectCode=${materialObjectCode}` : ''
  str += isAll ? `&isAll=${isAll}` : ''
  str += systemCode ? `&systemCode=${systemCode}` : ''
  return request.get(
    `/adapt/page?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}
