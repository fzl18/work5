import fetch from '@/utils/request'
let request = fetch()

//设置时区
export function saveTimeZone(data) {
  return request({
    url: '/index/personalset',
    method: 'POST',
    data,
  })
}
