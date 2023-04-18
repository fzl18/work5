import request from '@/utils/request'

export function getRouterList() {
  return request({
    url: '/index/menuList',
    method: 'post',
  })
}
