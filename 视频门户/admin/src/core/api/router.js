import fetch from '@/utils/request'

let request = fetch()
export function getRouterList() {
  return request({
    url: '/vportal/index/menuList',
    method: 'get',
  })
}

export function getPageResource(params) {
  return request({
    url: '/vportal/index/pageResource',
    method: 'get',
    params,
  })
}
