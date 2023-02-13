import apiCore from './config/index'

import { set } from 'lodash'

let request = apiCore.fetch
let fetchRoot = apiCore.fetchRoot

export default {

  // 物料分类树接口数据
  getClassTree: function (data) {
    return request({
      url: '/faultClass/getClassTree',
      method: 'GET',
      params: data.params,
      data: data.data,
    })
  },

  //物料分类接口
  getFaultInfoList: function (data) {
    return request({
      url: '/faultClass/page',
      method: 'POST',
      params: data.params,
      data: data.data,
    })
  },
  getFaultInfo: function (data) {
    return request({
      url: '/faultClass/getById',
      method: 'get',
      params: data.params,
      data: data.data,
    })
  },
  deleteFault: function (data) {
    return request({
      url: '/faultClass/delete',
      method: 'DELETE',
      params: data.params,
      data: data.data,
    })
  },
  saveFaultInfo: function (data) {
    return request({
      url: '/faultClass/save',
      method: 'POST',
      params: data.params,
      data: data.data,
    })
  },
  updateFaultInfo: function (data) {
    return request({
      url: '/faultClass/update',
      method: 'PUT',
      params: data.params,
      data: data.data,
    })
  },

  // 上传单个文件
  uploadFile: function uploadFile(data, prefixPath) {
    return request({
      url: `/file/uploadv2?prefixPath=${prefixPath}`,
      method: 'POST',
      data: data,
    })
  },
}
