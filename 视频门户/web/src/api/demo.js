import request from './baseRequest'

export function getRouterList(data) {
  return request({
    url: '/vportal/index/menuList',
    method: 'post',
    data,
  })
}

export function getPageResource(params) {
  return request({
    url: '/vportal/index/pageResource',
    method: 'get',
    params,
  })
}
