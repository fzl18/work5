import fetch from '@/utils/request'
const request = fetch()

export const watchDeviceData = (deviceId, params) => {
  return request({
    url: `arg/device/getDevicePointInfo/${deviceId}`,
    method: 'get',
    skipLoading: true,
    // skipErrorCatch: true,
    params,
  })
}

export const validateModbus = (postData) => {
  return request({
    url: `/arg/modbus/validateModbus`,
    method: 'post',
    data: postData,
  })
}

export const saveModbus = (postData) => {
  return request({
    url: `/arg/modbus/saveModbus`,
    method: 'post',
    data: postData,
  })
}

export const saveModbusRtu = (postData) => {
  return request({
    url: `/arg/modbusRtu/saveModbusRtu`,
    method: 'post',
    data: postData,
  })
}

export const saveMqttDevice = (postData) => {
  return request({
    url: `/arg/mqtt/saveOrUpdateMqtt`,
    method: 'post',
    data: postData,
  })
}

export const saveHttpServer = (postData) => {
  return request({
    url: `/arg/httpServer/updateHttpServer`,
    method: 'post',
    data: postData,
  })
}

export const saveRtspRtmpServer = (postData) => {
  return request({
    url: `/arg/rtspRtmp/saveOrUpdateRtspRtmp`,
    method: 'post',
    data: postData,
  })
}

export const getHttpServerById = (id) => {
  return request({
    url: `/arg/http/getHttpByDeviceId/${id}`,
    method: 'post',
  })
}

export const getMqttById = (id) => {
  return request({
    url: `/arg/mqtt/getMqttByDeviceId/${id}`,
    method: 'post',
  })
}

export const getModbusRtuById = (id) => {
  return request({
    url: `/arg/modbusRtu/getModbusRtuByDeviceId/${id}`,
    method: 'get',
  })
}

export const getModbusById = (id) => {
  return request({
    url: `/arg/modbus/getModbusByDeviceId/${id}`,
    method: 'get',
  })
}

export const getRtspRtmpById = (id) => {
  return request({
    url: `/arg/rtspRtmp/getRtspRtmpByDeviceId/${id}`,
    method: 'get',
  })
}

export const getDeviceList = (params) => {
  const page = {
    pageNum: 1,
    pageSize: 20,
  }
  return request({
    url: `/arg/device/queryDevice`,
    method: 'post',
    data: Object.assign({}, page, params),
  })
}

export const deleteDevice = (id) => {
  return request({
    url: `/arg/device/delDevice/${id}`,
    method: 'get',
  })
}

export const getHttpClientById = (id) => {
  return request({
    url: `/arg/httpClient/getHttpClientByDeviceId/${id}`,
    method: 'get',
  })
}

/**
 *
 * @param {
  {
 "deviceInfo": "AI异物检测相机",
 "deviceName": "gateway_modbus_Device_gteee",
 "deviceType": "default",
 "dictionaryId": 2,
 "dictionaryName": "HTTP_CLIENT_ARG",
 "dictionaryDescribe": "http描述",
 "ipAddress": "10.70.0.23",
 "endpoint": "/shebddd",
 "method": "POST",
 "timeout": 5,
 "isRedirect": 0,
 "pollTime": 100,
 "authType": "basic",
 "userName": "usename",
 "password": "password",
 "points": [
     {
         "dataAddress": 399,
         "dataType": "long",
         "name": "k40400",
         "objectsCount": 1,
         "readType": 3
     },
     {
         "dataAddress": 400,
         "dataType": "long",
         "name": "k40401",
         "objectsCount": 1,
         "readType": 3
     }
 ],
 "httpHeader": "{\"ACCEPT\":\"application/json\"}",
 "isSsl": 0
}} postData
 * @returns
 */
export const saveHttpClient = (postData) => {
  return request({
    url: `/arg/httpClient/saveHttpClient`,
    method: 'post',
    data: postData,
  })
}
