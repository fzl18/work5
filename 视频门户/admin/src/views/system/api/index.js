import request from './baseRequest'
import request2 from '@/utils/request'
const fetch = request2('/')
export function getSysUnit(code) {
  //分类管理
  return fetch({
    url: `/sysauth/system/platform/allunits/${code}`, // /sysauth/system/unitinfo
    method: 'get',
  })
}

export function getVideoCategory(params) {
  //分类管理
  return request({
    url: 'vportal/videoCategory?size=999',
    method: 'get',
    params,
  })
}

export function postVideoCategory(data) {
  return request({
    url: 'vportal/videoCategory',
    method: 'post',
    data,
  })
}

export function putVideoCategory(data) {
  //分类管理
  return request({
    url: 'vportal/videoCategory',
    method: 'put',
    data,
  })
}

export function delVideoCategory(params) {
  //分类管理
  return request({
    url: 'vportal/videoCategory',
    method: 'delete',
    params,
  })
}

export function sortVideoCategory(data) {
  //分类管理
  return request({
    url: 'vportal/videoCategory/sort',
    method: 'put',
    data,
  })
}

// ==========================================================================
export function getWorkflowSavecheck(data) {
  //分类管理
  return request({
    url: 'vportal/videoCategory',
    method: 'delete',
    data,
  })
}
export function getWorkflowWorkflowList(data) {
  //分类管理
  return request({
    url: 'vportal/videoCategory',
    method: 'delete',
    data,
  })
}

// =============================================================================

export function getVideoList(params) {
  //所有视频列表
  return request({
    url: 'vportal/video',
    method: 'get',
    params,
  })
}
export function postVideo(data) {
  //添加视频
  return request({
    url: 'vportal/video',
    method: 'post',
    data,
  })
}
export function putVideo(data) {
  //更新视频
  return request({
    url: 'vportal/video',
    method: 'put',
    data,
  })
}
export function delVideo(params) {
  //删除视频
  return request({
    url: 'vportal/video',
    method: 'delete',
    params,
  })
}
export function getOnelVideo(id) {
  //一条视频
  return request({
    url: `vportal/video/${id}`,
    method: 'get',
  })
}

export function getvideoLog(params) {
  //转换日志列表
  return request({
    url: `vportal/videoLog`,
    method: 'get',
    params,
  })
}
export function getVideoLogDetail(id) {
  //删除视频
  return request({
    url: `vportal/videoLog/${id}`,
    method: 'get',
  })
}
export function putVideoSettings(data) {
  //视频设置
  return request({
    url: `vportal/videoSettings`,
    method: 'put',
    data,
  })
}
export function getVideoSelectByVkey(params) {
  //视频设置
  return request({
    url: `vportal/videoSettings/selectByVkey`,
    method: 'get',
    params,
  })
}
export function getSysLog(params) {
  //视频设置
  return request({
    url: `vportal/sysLog`,
    method: 'get',
    params,
  })
}
