import fetch from '@/utils/request'
const request = fetch()

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export const uploadImageFromBase64 = (dataurl, filename) => {
  let file = dataURLtoFile(dataurl, filename)
  const formData = new FormData()
  formData.append('img', file)
  return request({
    url: `/image/imgUpload`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    method: 'post',
    skipLoading: true,
    data: formData,
  })
}

export const updateFlowImage = (id, filename) => {
  return request({
    url: `/flow/flowGroup/updateFlowGroupImageById`,
    method: 'post',
    skipLoading: true,
    data: {
      id: id,
      flowGroupIcon: filename,
    },
  })
}
