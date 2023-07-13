function ajaxPost(url, callback, data = {}) {
  url = url + '?' + parseParams(data)
  //不必拼接时间戳
  var xhr = new XMLHttpRequest()
  //区别2
  xhr.open('POST', url, true)
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(xhr.responseText)
    }
  }
  //区别3:发送前设置数据格式
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  //区别1:数据发送在send内
  xhr.send()
}
import axios from 'axios'
import { UPLOADER_API } from './config'

// export function mearge(params) {
//     return axios({
//         method: "post",
//         url: UPLOADER_API.simpleMergeURL,
//         params
//     })
// }
export function getFileList(params, clientCode) {
  return axios({
    method: 'post',
    url: UPLOADER_API.simpleListURL,
    params,
    headers: { ...{ 'cnt-current-client-code': clientCode } },
  })
}
export function merge(params, clientCode) {
  return axios({
    method: 'post',
    url: UPLOADER_API.simpleMergeURL,
    params,
    headers: { ...{ 'cnt-current-client-code': clientCode } },
  })
}

function parseParams(data) {
  try {
    var tempArr = []
    for (var i in data) {
      var key = encodeURIComponent(i)
      var value = encodeURIComponent(data[i])
      if (value && value != 'null') {
        tempArr.push(key + '=' + value)
      }
    }
    var urlParamsStr = tempArr.join('&')
    return urlParamsStr
  } catch (err) {
    return ''
  }
}

export function download(id, fileName, clientCode) {
  axios({
    method: 'get',
    url: UPLOADER_API.simpleDownloadURL + '?id=' + id,
    responseType: 'blob',
    headers: { ...{ 'cnt-current-client-code': clientCode } },
  })
    .then((res) => {
      if (!res) {
        return
      }
      // 将lob对象转换为域名结合式的url
      let blobUrl = window.URL.createObjectURL(res.data)
      let link = document.createElement('a')
      document.body.appendChild(link)
      link.style.display = 'none'
      link.href = blobUrl
      // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
      link.download = fileName
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
      console.log('下载成功！')
    })
    .catch(() => {
      console.log('下载失败！')
    })
}
