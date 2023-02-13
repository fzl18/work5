import fetch from '@/utils/request'
const request = fetch()

export const getFlowList = (params) => {
  const page = {
    pageNum: 1,
    pageSize: 20,
  }
  return request({
    url: `/flow/flowGroup/queryFlowGroup`,
    method: 'post',
    data: Object.assign({}, page, params),
  })
}

export const getFlowInfoById = (id) => {
  return request({
    url: `/flow/flowGroup/getFlowGroupByGroupId/${id}`,
    method: 'get',
  })
}

export const saveFlow = (postData) => {
  return request({
    url: `/flow/flowGroup/saveOrUpdateFlowGroup`,
    method: 'post',
    data: postData,
  })
}

export const deleteFlow = (id) => {
  return request({
    url: `/flow/flowGroup/deleteFlowGroup/${id}`,
    method: 'post',
  })
}

/**
 *
 * @param {*} postData
 * @description {
      id:id,
      isRun:isRun 0是启用,1禁用
    }
 * @returns
 */
export const toggleFlowStatus = (postData) => {
  return request({
    url: `/flow/flowGroup/onOffFlowGroup`,
    method: 'post',
    data: postData,
  })
}

/**
 * @description 创建新节点
 * @param {*} postData:{"subCode":"INDUSTRY_DEVICE_BINDING","flowGroupId":2}
 *
 * subCode:参考FlowComponentTypes
 * flowGroupId:主流程ID
 * @returns
 */
export const createNode = (postData) => {
  return request({
    url: `/flow/flow/saveFlow`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}

export const deleteNode = (nodeId) => {
  return request({
    url: `/flow/flow/delFlow/${nodeId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 更新流程的拓扑图结构
 * @params postData
 * [
    {
        "id":0, 如果code是EDGE,则id是0
        "code":"EDGE",
        "source":65,
        "target":66,
        "name":"",如果code是EDGE,则name是""
        "metadata":"" 节点和边的元数据
    }
  ]
 */
export const updateFlowData = (flowId, postData, skipLoading) => {
  return request({
    url: `/flow/flow/saveFlowEdge/${flowId}`,
    method: 'post',
    skipLoading: skipLoading,
    data: postData,
  })
}

/**
 * 更新流程的拓扑图结构
 * @params postData
 * [
    {
        "id":0, 如果code是EDGE,则id是0
        "code":"EDGE",
        "source":65,
        "target":66,
        "name":"",如果code是EDGE,则name是""
        "metadata":"" 节点和边的元数据
    }
  ]
 */
export const getFlowDataById = (flowId) => {
  return request({
    url: `/flow/flow/queryFlowByGroupId/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 *  获取绑定设备列表
 * @param {*} deviceName
 * @param {*} dictionaryName  RTSP_RTMP_ARG=视频设备,不填=其他
 * @returns
 */
export const getBindDevice = (deviceName, dictionaryName = null) => {
  return request({
    url: `/arg/device/queryBindDevice`,
    method: 'post',
    skipLoading: true,
    data: {
      deviceName,
      dictionaryName,
    },
  })
}

export const getBindDeviceData = (flowId) => {
  return request({
    url: `/flow/deviceRule/getDeviceRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 获取绑定点位
 * @param {*} id
 * @returns
 */
export const getBindDevicePoint = (id) => {
  return request({
    url: `/arg/device/queryBindDevicePoint/${id}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * @description 保存或者修改绑定设备信息
 * @param {*} {"deviceName":"gateway_modbus_Device_A7","deviceId":46,"flowId":109,"collectionPoint":"44,45,56"}
 * @returns
 */
export const updateBindDevice = (postData) => {
  return request({
    url: `/flow/deviceRule/saveOrUpdateDeviceRule`,
    method: 'post',
    skipLoading: true,
    data: postData,
  })
}
