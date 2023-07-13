import fetch from '@/utils/request'
let request = fetch()

export function measureList(data) {
  return request({
    url: '/measure/list',
    method: 'POST',
    data,
  })
}
