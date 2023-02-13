import fetch from '@/utils/request'
const request = fetch()

export const getHttp = (flowId) => {
  return request({
    url: `/flow/httpRule/getHttpRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"flowId":131,"timeout":1233,"httpHeard":"","authType":"auth","username":"1222","password":"21222"}} postData
 * @returns
 */
export const updateHttp = (postData) => {
  return request({
    url: `/flow/httpRule/saveOrUpdateHttpRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}

export const getMqtt = (flowId) => {
  return request({
    url: `/flow/mqttRule/getMqttRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"isBitplat":0,"brokerAddress":"172.0.0.1","port":1233,"clientId":"1222","userName":"23332","password":"212123","topic":"/dedede","flowId":131,"authType":"auth","accessToken":"3211111","safeType":"321312","cacert":"/dedded/de"}} postData
 * @returns
 */
export const updateMqtt = (postData) => {
  return request({
    url: `/flow/mqttRule/saveOrUpdateMqttRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}

export const getVideo = (flowId) => {
  return request({
    url: `/flow/rtspRtmpRule/getRtspRtmpRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"flowId":131,"deviceName":"222","isBitplat":0,"url":"dejdejdje/dedede","deviceId":2222}} postData
 * @returns
 */
export const updateVideo = (postData) => {
  return request({
    url: `/flow/rtspRtmpRule/saveOrUpdateRtspRtmpRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}
