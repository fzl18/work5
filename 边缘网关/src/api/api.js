import fetch from '@/utils/request'
const request = fetch()

export function reboot() {
  return request({
    url: '/edgegateway-api/reboot',
    method: 'post',
  })
}
export function getLogs({ page, level, startTime, endTime } = query) {
  let headers = {}
  if (level && level != '') headers = { ...headers, ...{ level } }
  if (startTime && startTime != '') headers = { ...headers, ...{ startTime } }
  if (endTime && endTime != '') headers = { ...headers, ...{ endTime } }

  return request({
    url: `/edgegateway-api/logs/${page}`,
    method: 'get',
    headers: headers,
  })
}

//网关配置
export function configList() {
  return request({
    url: `/edgegateway-api/config/types`,
    method: 'get',
  })
}
export function configFile(filename) {
  return request({
    url: `/edgegateway-api/config/file`,
    method: 'get',
    headers: { filename },
  })
}

export function saveConfigFile(filename, fileJson) {
  return request({
    url: `/edgegateway-api/config/file`,
    method: 'post',
    headers: { filename, fileJson },
  })
}
export function validateConfigFile(filename, fileJson) {
  return request({
    url: `/edgegateway-api/config/validate`,
    method: 'post',
    headers: { filename, fileJson },
  })
}

export function deviceTypes() {
  return request({
    url: '/edgegateway-api/device/types',
    method: 'get',
  })
}

export function deviceList({ page, deviceType, textSearch }) {
  let headers = {}
  if (deviceType && deviceType != '')
    headers = { ...{ headers }, ...{ deviceType } }
  if (textSearch && textSearch != '')
    headers = { ...{ headers }, ...{ textSearch } }

  return request({
    url: `/edgegateway-api/device/list/${page}`,
    method: 'get',
    headers: headers,
  })
}

export function deviceDetail(deviceName) {
  return request({
    url: `/edgegateway-api/device/detail/${deviceName}`,
    method: 'get',
  })
}
