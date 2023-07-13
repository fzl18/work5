import fetch from '@/utils/request'
let request = fetch()
import fetch2 from '@/utils/request2'
let request2 = fetch2('/filebase/api')

export function getRhythmList(data) {
  return request({
    url: '/item/cts',
    method: 'POST',
    data,
  })
}

export function getRhythmById(data) {
  return request({
    url: '/item/ct',
    method: 'POST',
    data,
  })
}

export function addRhythm(data) {
  return request({
    url: '/item/ct/new',
    method: 'POST',
    data,
  })
}

export function editRhythm(data) {
  return request({
    url: '/item/ct',
    method: 'PUT',
    data,
  })
}

export function delRhythm(data) {
  return request({
    url: '/item/cts',
    method: 'DELETE',
    data,
  })
}

export function getProductList(data) {
  return request({
    url: '/mt/products',
    method: 'POST',
    data,
  })
}

export function getProductById(data) {
  return request({
    url: '/mt/detail',
    method: 'POST',
    data,
  })
}

export function getProductTypeList(data) {
  return request({
    url: '/mt/categorys',
    method: 'POST',
    data,
  })
}

export function getLineList(data) {
  return request({
    url: '/ins/section/list',
    method: 'POST',
    data,
  })
}

export function getDocumentList(data) {
  return request({
    url: '/archives',
    method: 'POST',
    data,
  })
}

export function addDocument(data) {
  return request({
    url: '/archive',
    method: 'POST',
    data,
  })
}

export function delDocument(data) {
  return request({
    url: '/archives',
    method: 'DELETE',
    data,
  })
}

export function getDocumentUrl(params) {
  return request({
    url: `/archive/${params.id}/fsurl`,
    method: 'GET',
  })
}

export function getSopList(data) {
  return request({
    url: '/sops',
    method: 'POST',
    data,
  })
}

export function addSop(data) {
  return request({
    url: '/sop',
    method: 'POST',
    data,
  })
}

export function delSop(data) {
  return request({
    url: '/sops',
    method: 'DELETE',
    data,
  })
}

export function getSopUrl(params) {
  return request({
    url: `/sop/${params.id}/fsurl`,
    method: 'GET',
  })
}

export function uploadFile(data) {
  return request2({
    url: '/index/upload',
    method: 'post',
    data,
  })
}

export function uploadFileChunk(data) {
  return request2({
    url: '/index/resource',
    method: 'post',
    data,
  })
}

export function mergeFileChunk(params) {
  return request2({
    url: '/index/merge',
    method: 'post',
    params,
  })
}
