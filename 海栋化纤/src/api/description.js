import request from '@/utils/request'

///const apiURL = "/description/getList";

export function getList() {
  return request({
    url: '/description/getList',
    method: 'get',
  })
}
