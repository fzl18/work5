import fetch from '@/utils/request'
let request = fetch()

export function getStorageList(data) {
  return request({
    url: '/storage/list',
    method: 'POST',
    data,
  })
}

export function getSystemList(params) {
  return request({
    url: '/ins/list',
    method: 'GET',
    params,
  })
}

export function saveStorage(data) {
  return request({
    url: '/storage/update',
    method: 'POST',
    data,
  })
}

export function getRegionList(data) {
  return request({
    url: '/storage/regionlist',
    method: 'POST',
    data,
  })
}

export function saveRegion(data) {
  return request({
    url: '/storage/saveRegion',
    method: 'POST',
    data,
  })
}

export function delRegion(params) {
  return request({
    url: `/storage/region/del/${params.ids}`,
    method: 'DELETE',
  })
}

export function getPlaceList(data) {
  return request({
    url: '/storage/stationlist',
    method: 'POST',
    data,
  })
}

export function savePlace(data) {
  return request({
    url: '/storage/saveStation',
    method: 'POST',
    data,
  })
}

export function delPlace(params) {
  return request({
    url: `/storage/station/del/${params.ids}`,
    method: 'DELETE',
  })
}
