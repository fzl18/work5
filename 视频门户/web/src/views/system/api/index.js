import request from './baseRequest'

export function getList(params) {
  //获取积分记录
  return request({
    url: 'scoreRecord/list',
    method: 'get',
    params,
  })
}

// ===============================首页

export function getVideoCategory(params) {
  //分类管理
  return request({
    url: 'vportal/videoCategory?size=999',
    method: 'get',
    params,
  })
}
export function getUserVideo(params) {
  //视频列表
  return request({
    url: 'vportal/userVideo',
    method: 'get',
    params,
  })
}
export function getUserVideoOne(id) {
  //id取视频
  return request({
    url: `vportal/userVideo/${id}`,
    method: 'get',
  })
}
export function getUserLike(params) {
  // 点赞列表
  return request({
    url: `vportal/userLike`,
    method: 'get',
    params,
  })
}
export function postUserLike(data) {
  // 点赞添加
  return request({
    url: `vportal/userLike`,
    method: 'post',
    data,
  })
}
export function delUserLike(params) {
  // 点赞删除
  return request({
    url: `vportal/userLike`,
    method: 'delete',
    params,
  })
}
export function getUserFavorite(params) {
  // 收藏列表
  return request({
    url: `vportal/userFavorite`,
    method: 'get',
    params,
  })
}
export function postUserFavorite(data) {
  // 收藏添加
  return request({
    url: `vportal/userFavorite`,
    method: 'post',
    data,
  })
}
export function delUserFavorite(params) {
  // 收藏删除
  return request({
    url: `vportal/userFavorite`,
    method: 'delete',
    params,
  })
}
export function getUserVideoLog(params) {
  // 播放列表
  return request({
    url: `vportal/userVideoLog`,
    method: 'get',
    params,
  })
}
export function postUserVideoLog(data) {
  // 播放添加
  return request({
    url: `vportal/userVideoLog`,
    method: 'post',
    data,
  })
}
export function delUserVideoLog(params) {
  // 播放删除
  return request({
    url: `vportal/userVideoLog`,
    method: 'delete',
    params,
  })
}
