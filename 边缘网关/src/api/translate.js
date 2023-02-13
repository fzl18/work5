import fetch from '@/utils/request'
const request = fetch()

export const getFilter = (flowId) => {
  return request({
    url: `/flow/filterRule/getFilterRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"timeJson":"[{begin:'10:10:10',end:'10:10:10'}]","rangeLowerLimit":30,"rangeTopLimit":34,"rawDataLowerLimit":23,"rawDataTopLimit":34,"flowId":1,"timeIsBegin":1,"changeIsBegin":1}} postData
 * @returns
 */
export const updateFilter = (postData) => {
  return request({
    url: `/flow/filterRule/saveOrUpdateFilterRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}

export const getThreshold = (flowId) => {
  return request({
    url: `/flow/warnRule/getWarnRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"thresholdLowerLimit":20,"thresholdTopLimit":30,"flowId":131}} postData
 * @returns
 */
export const updateThreshold = (postData) => {
  return request({
    url: `/flow/warnRule/saveOrUpdateWarnRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}
