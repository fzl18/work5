import fetch from '@/utils/request'
let request = fetch()

export function getList(data) {
  return request({
    url: '/boms',
    method: 'POST',
    data,
  })
}

export function getSubList(data) {
  return request({
    url: '/bom',
    method: 'POST',
    data,
  })
}
export function getSubDetail(data) {
  return request({
    url: '/bom/child',
    method: 'POST',
    data,
  })
}
export function getSubStep(data) {
  return request({
    url: '/bom/child-step-usage',
    method: 'POST',
    data,
  })
}
export function getVersions(data) {
  return request({
    url: '/bom/versions',
    method: 'POST',
    data,
  })
}
