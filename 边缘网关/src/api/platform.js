import fetch from '@/utils/request'
const request = fetch()

export const getIot = (flowId) => {
  return request({
    url: `/flow/iotAttributesRule/getIotAttributesRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{
    "id": 1,
    "name": "试试",
    "flowId": 38,
    "bitplatUsername": "CVm78bvQna5nFjisNbYs",
    "attributes": "Switch"
}} postData
 * @returns
 */
export const updateIot = (postData) => {
  return request({
    url: `/flow/iotAttributesRule/saveOrUpdateIotAttributesRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}
