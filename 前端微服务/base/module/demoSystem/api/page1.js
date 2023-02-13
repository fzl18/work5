import request from './baseRequest'

export function getRouterList(data) {
  return request({
    url: '/index/menuList',
    method: 'post',
    data,
  })
}

export function getPageResource(params) {
  return request({
    url: '/index/pageResource',
    method: 'get',
    params,
  })
}
