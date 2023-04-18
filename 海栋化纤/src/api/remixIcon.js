import request from '@/utils/request'

//const apiURL = "/remixIcon/getList";

export function getIconList(params) {
  return request({
    url: '/remixIcon/getList',
    method: 'get',
    params,
  })
}
