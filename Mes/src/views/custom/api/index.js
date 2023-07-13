import fetch from '@/utils/request'
let request = fetch()

export function getCustomersList(data) {
  return request({
    url: '/customers',
    method: 'POST',
    data,
  })
}

export function getCustomer(data) {
  return request({
    url: `/customer/${data}`,
    method: 'get',
  })
}
