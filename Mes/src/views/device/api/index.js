import fetch from '@/utils/request'
let request = fetch()

export function getDeviceList(data) {
  return request({
    url: '/devices',
    method: 'POST',
    data,
  })
}

export function getDeviceById(params) {
  return request({
    url: `/device/${params.id}`,
    method: 'GET',
  })
}

export function addDevice(data) {
  return request({
    url: '/device',
    method: 'POST',
    data,
  })
}

export function editDevice(data) {
  return request({
    url: '/device',
    method: 'PUT',
    data,
  })
}

export function delDevice(data) {
  return request({
    url: '/devices',
    method: 'DELETE',
    data,
  })
}

export function getSystemList() {
  return request({
    url: '/ins/list',
    method: 'GET',
  })
}
