import request from '@/utils/request'

//const apiURL = "/notice/getList";

export function getList() {
  return request({
    url: '/notice/getList',
    method: 'get',
  })
}
