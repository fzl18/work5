import fetch from '@/utils/request'
const request = fetch()

export const getHttpServer = () => {
  return request({
    url: `/arg/httpServer/getHttpServer`,
    method: 'get',
  })
}

export const saveHttpServer = (postData) => {
  return request({
    url: `/arg/httpServer/updateHttpServer`,
    method: 'post',
    data: postData,
  })
}

export const saveHttpServerDevice = (postData) => {
  return request({
    url: `/arg/httpServer/updateHttpServerDevice`,
    method: 'post',
    data: postData,
  })
}

export const getPointListByHttpId = (httpId) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/queryPointsByHttpId/${httpId}`,
    method: 'get',
  })
}

export const getHttpRest = (httpId) => {
  return request({
    url: `/arg/http/getHttpByDeviceId/${httpId}`,
    method: 'get',
  })
}

export const saveHttpRest = (postData) => {
  return request({
    url: `/arg/http/saveOrUpdateHttp`,
    method: 'post',
    data: postData,
  })
}

export const savePoint = (postData) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/saveOrUpdateHttpPoint`,
    method: 'post',
    data: postData,
  })
}

export const deletePoint = (id) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/delPoint/${id}`,
    method: 'get',
  })
}

export const batchDeletePoints = (ids) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/delPoints`,
    method: 'post',
    data: {
      ids,
    },
  })
}

export const getPointById = (id) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/getPoints/${id}`,
    method: 'get',
  })
}
