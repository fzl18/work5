import request from '@/utils/request'

export function buscusIndex(data) {
  //客户与运输公司表列表
  return request({
    url: 'buscus/index',
    method: 'post',
    data,
  })
}

export function buscusAdd(data) {
  //增
  return request({
    url: 'buscus/add',
    method: 'post',
    data,
  })
}

export function buscusEdit(data) {
  //编辑
  return request({
    url: 'buscus/edit',
    method: 'post',
    data,
  })
}
export function buscusDel(data) {
  //删
  return request({
    url: 'buscus/del',
    method: 'post',
    data,
  })
}
