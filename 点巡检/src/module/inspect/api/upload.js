import request from './baseRequest'

//upload
export const uploadImgApi = async (data) =>
  request.post('/file/imagesUpload', data)

export const uploadFileApi = (data) => request.post('/file/fileUpload', data)

//排班导入 /scheduling/excelImport
export const schedulingExcelImport = ({ title }, data) =>
  request.post(`/scheduling/excelImport?title=${title}`, data)
