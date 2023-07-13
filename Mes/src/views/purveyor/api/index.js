import fetch from '@/utils/request'
let request = fetch()

export function getPurveyorList(data) {
  return request({
    url: '/suppliers',
    method: 'POST',
    data,
  })
}

export function getPurveyorById(params) {
  return request({
    url: `/supplier/${params.id}`,
    method: 'GET',
  })
}

export function getContactList(data) {
  return request({
    url: '/contacts',
    method: 'POST',
    data,
  })
}
