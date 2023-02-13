/**
 * 协议类型映射
 * @descripition 该映射是为component is 注册的组件服务
 * ! 值需要与src\views\device\components的组件name保持一致
 */
export const AgreementType = {
  /**
   * @description ModbusTcp
   */
  MODBUS_TCP_ARG: 'ModbusTcp',
  MQTT_ARG: 'Mqtt',
  HTTP_SERVER_ARG: 'HttpServer',
  RTSP_RTMP_ARG: 'RtspRtmp',
  MODBUS_RTU_ARG: 'ModbusRtu',
  HTTP_CLIENT_ARG: 'HttpClient',
}

Object.freeze(AgreementType)
/**
 * @description 前后端协议类型编码转换
 * @param {string} serverCode 后端代码编号
 * @return {string} feCode 前端代码编号
 */
export const transformAgreement = (serverCode) => {
  //mapping表
  if (!serverCode) {
    return null
  }

  if (!AgreementType.hasOwnProperty(serverCode)) {
    throw 'unknow server agreement type!'
  }
  return AgreementType[serverCode]
}
