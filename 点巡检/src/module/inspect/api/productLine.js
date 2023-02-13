import request from './baseRequest'

//输送线 productLine
export const getProductLineList = async ({
  pageSize = 10,
  pageNum = 1,
  name,
  workSpaceId,
}) => {
  let str = name ? `&name=${name}` : ''
  str += workSpaceId ? `&workSpaceId=${workSpaceId}` : ''
  return request.get(
    `/factory/pageLine?pageSize=${pageSize}&pageNum=${pageNum}${str}`
  )
}

//新建输送线
export const createNewProductLine = (data) =>
  request.post('/factory/saveProductLine', data)

//产线信息更新
export const updateProductLineInfo = (data) =>
  request.post('/factory/updateProductLine', data)

//删除输送线
export const deleteProductLine = (data) =>
  request.post('/factory/deleteProductLine', data)
