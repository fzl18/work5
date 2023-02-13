import fetch from '@/utils/request'
const request = fetch()

export const getMqttServer = () => {
  return request({
    url: `/arg/mqttServer/getMqttServer`,
    method: 'get',
  })
}

export const saveMqttServer = (postData) => {
  return request({
    url: `/arg/mqttServer/saveOrUpdateMqttServer`,
    method: 'post',
    data: postData,
  })
}

export const getTopicListByMqttId = (mqttId) => {
  return request({
    url: `/arg/topic/queryTopicByMqttServerId/${mqttId}`,
    method: 'get',
  })
}

export const saveTopic = (postData) => {
  return request({
    url: `/arg/topic/saveOrUpdateTopic`,
    method: 'post',
    data: postData,
  })
}

export const savePoint = (postData) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/saveOrUpdateTopicPoint`,
    method: 'post',
    data: postData,
  })
}

export const deleteTopic = (id) => {
  return request({
    url: `/arg/topic/delTopic/${id}`,
    method: 'get',
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

export const getTopicList = () => {
  return request({
    url: `/arg/topic/queryTopic`,
    method: 'get',
  })
}

export const getTopicById = (id) => {
  return request({
    url: `/arg/topic/getTopicById/${id}`,
    method: 'get',
  })
}

export const getPointById = (id) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/getPoints/${id}`,
    method: 'get',
  })
}

export const getPointListByTopicId = (topicId) => {
  return request({
    url: `/arg/topicHttpCollectionPoint/queryPointsByTopicId/${topicId}`,
    method: 'get',
  })
}
