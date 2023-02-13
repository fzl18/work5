import apiCore from './config'

import { set } from 'lodash'

let request = apiCore.fetch
let fetchRoot = apiCore.fetchRoot

export default {
  incredientTable: function getList(data) {
    return request({
      url: '/purchaseapplyinfo/page',
      method: 'POST',
      params: data.params,
      data: data.data,
    })
  },

  // 文件上传接口
  uploadFiles: function uploadFiles(data, sn) {
    return fetchRoot({
      url: `/fileUpload/file/fileinfo/uploads?bucketName=purchase&sn=${sn}`,
      method: 'POST',
      data: data,
    })
  },
  // 上传单个文件
  uploadFile: function uploadFile(data, sn) {
    return fetchRoot({
      url: `/fileUpload/file/fileinfo/upload?bucketName=purchase&sn=${sn}`,
      method: 'POST',
      data: data,
    })
  },
  copyFile: function copyFile(oldsn, sn) {
    return fetchRoot({
      url: `/fileUpload/file/fileinfo/uploadcopy?oldsn=${oldsn}&sn=${sn}`,
      method: 'POST',
    })
  },
  // 文件查看接口
  lookFileList: function lookFileList(params) {
    return fetchRoot({
      url: `/fileUpload/file/fileinfo/list`,
      method: 'GET',
      params,
    })
  },
  // 文件删除接口
  deleteFile: function deleteFile(params) {
    return fetchRoot({
      url: `/fileUpload/file/fileinfo`,
      method: 'DELETE',
      params,
    })
  },
  // 文件下载接口
  downloadByFileId: function downloadByFileId(params) {
    return fetchRoot({
      url: `/fileUpload/file/fileinfo/downloadFileById`,
      method: 'GET',
      params,
    })
  },
}
