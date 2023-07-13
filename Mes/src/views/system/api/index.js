import fetch from '@/utils/request'
let request = fetch()
import fetch2 from '@/utils/request2'
let request2 = fetch2()

export function getSystemList() {
  return request({
    url: '/ins/list',
    method: 'GET',
  })
}

export function getLineById(params) {
  return request({
    url: `/ins/section/${params.id}`,
    method: 'GET',
  })
}

export function saveLine(data) {
  return request({
    url: '/ins/saveSection',
    method: 'POST',
    data,
  })
}

export function delLine(params) {
  return request({
    url: `/ins/del/${params.ids}`,
    method: 'DELETE',
  })
}

export function getUserList(data) {
  return request({
    url: '/ins/userlist',
    method: 'POST',
    data,
  })
}

export function getLineByDept(params) {
  return request({
    url: `/ins/sections/${params.depCode}`,
    method: 'GET',
  })
}

export function saveLineUser(data) {
  return request({
    url: '/ins/saveSecUser',
    method: 'POST',
    data,
  })
}

export function delLineUser(params) {
  return request({
    url: `/ins/deluser/${params.ids}`,
    method: 'DELETE',
  })
}

export function getUserDetail(data) {
  return request({
    url: '/ins/userinfo',
    method: 'POST',
    data,
  })
}

// xxxxxxxxxxxxxxx

export function getLodgingList(data) {
  return request({
    url: '/stay/list',
    method: 'POST',
    data,
  })
}

export function getLodgingById(params) {
  return request({
    url: '/stay/getInfo',
    method: 'POST',
    params,
  })
}

export function addLodging(data) {
  return request({
    url: '/stay/add',
    method: 'POST',
    data,
  })
}

export function editLodging(data) {
  return request({
    url: '/stay/edit',
    method: 'POST',
    data,
  })
}

export function delLodging(params) {
  return request({
    url: '/stay/delete',
    method: 'POST',
    params,
  })
}

export function getEmployeeList(params) {
  return request({
    url: '/employee/queryByNameAndBadge',
    method: 'POST',
    params,
  })
}

export function downloadBlob() {
  return request2({
    url: '/stay/download',
    method: 'GET',
    responseType: 'blob',
  })
}

export function uploadFile(data) {
  return request({
    url: '/stay/import',
    method: 'POST',
    data,
  })
}
