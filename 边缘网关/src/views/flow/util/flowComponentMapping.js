export const FlowComponentTypes = {
  /**
   * @description 工业设备绑定组件
   */
  devicesHard: 'INDUSTRY_DEVICE_BINDING',
  /**
   * @description 视频设备绑定组件
   */
  devicesVideo: 'VIEW_DEVICE_BINDING',
  /**
   *  @description 数据过滤
   */
  translateFilter: 'DATA_FILTER',
  /**
   * @description 阈值设定
   */
  translateThreshold: 'THRESHOLD_SETTING',
  /**
   * @description MQTT输出组件
   */
  outputMqtt: 'MQTT_SUB',
  /**
   * @description HTTP/S输出组件
   */
  outputHttp: 'HTTP_HTTPS_SUB',
  /**
   * @description 视频流输出组件
   */
  outputVideoSteam: 'VIEW_STREAM_SUB',

  /**
   * @description 平台报警组件
   */
  eventWarning: 'PLATFORM_ALARM_SUB',
  /**
   * @description 发送邮件组件
   */
  eventEmail: 'SEND_EMAIL_SUB',
  /**
   * @description  计算组件
   */
  computeMath: 'COUNT_SUB',
}

Object.freeze(FlowComponentTypes)
/**
 * @description 前后端协议类型编码转换
 * @param {string} serverCode 后端代码编号
 * @return {string} feCode 前端代码编号
 */
export const transformFlowComponentTypes = (serverCode) => {
  //mapping表
  if (!serverCode) {
    return null
  }

  if (!FlowComponentTypes.hasOwnProperty(serverCode)) {
    throw 'unknow server component type!'
  }
  return FlowComponentTypes[serverCode]
}
