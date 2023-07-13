import fetch from '@/utils/request'
let request = fetch()

//获取字典
export function getDictionary(data) {
  return request({
    url: '/index/dicts',
    method: 'POST',
    data,
  })
}
