import fetch from '@/utils/request'
const request = fetch()

export const getMath = (flowId) => {
  return request({
    url: `/flow/formulaRule/getFormulaRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"formula":"2+2","flowId":131,"collectionName":"k004"}} postData
 * @returns
 */
export const updateMath = (postData) => {
  return request({
    url: `/flow/formulaRule/saveOrUpdateFormulaRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}
