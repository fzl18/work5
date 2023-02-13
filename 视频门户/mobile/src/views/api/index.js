import request from "./baseRequest";

export function getVideoCategory(params) {
  //分类管理
  return request({
    url: "vportal/app/videoCategory?size=999",
    method: "get",
    params,
  });
}
export function getUserVideo(params) {
  //视频列表
  return request({
    url: "vportal/app/userVideo",
    method: "get",
    params,
  });
}
export function getUserVideoOne(id) {
  //id取视频
  return request({
    url: `vportal/app/userVideo/${id}`,
    method: "get",
  });
}
export function getUserLike(params) {
  // 点赞列表
  return request({
    url: `vportal/app/userLike`,
    method: "get",
    params,
  });
}
export function postUserLike(data) {
  // 点赞添加
  return request({
    url: `vportal/app/userLike`,
    method: "post",
    data,
  });
}
export function delUserLike(params) {
  // 点赞删除
  return request({
    url: `vportal/app/userLike`,
    method: "delete",
    params,
  });
}
export function getUserFavorite(params) {
  // 收藏列表
  return request({
    url: `vportal/app/userFavorite`,
    method: "get",
    params,
  });
}
export function postUserFavorite(data) {
  // 收藏添加
  return request({
    url: `vportal/app/userFavorite`,
    method: "post",
    data,
  });
}
export function delUserFavorite(params) {
  // 收藏删除
  return request({
    url: `vportal/app/userFavorite`,
    method: "delete",
    params,
  });
}
export function getUserVideoLog(params) {
  // 播放列表
  return request({
    url: `vportal/app/userVideoLog`,
    method: "get",
    params,
  });
}
export function postUserVideoLog(data) {
  // 播放添加
  return request({
    url: `vportal/app/userVideoLog`,
    method: "post",
    data,
  });
}
export function delUserVideoLog(params) {
  // 播放删除
  return request({
    url: `vportal/app/userVideoLog`,
    method: "delete",
    params,
  });
}
export function getUserInfo(params) {
  // 用户信息
  return request({
    url: `vportal/app/user/info`,
    method: "get",
    params,
  });
}
