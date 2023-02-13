import fetch from '@/utils/request'
const request = fetch()

export const getWarning = (flowId) => {
  return request({
    url: `/flow/platWarnRule/getPlatWarnRuleById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"flowId":131,"warnNo":"33222","warnType":"2222","warnInfo":"222222","warnLevel":12,"isHour":0,"isOk":0}} postData
 * @returns
 */
export const updateWarning = (postData) => {
  return request({
    url: `/flow/platWarnRule/saveOrUpdatePlatWarnRule`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}

export const getEmail = (flowId) => {
  return request({
    url: `/flow/emailInfo/getEmailInfoById/${flowId}`,
    method: 'get',
    skipLoading: true,
  })
}

/**
 * 保存或者修改过滤组件信息
 * @param {{"flowId":131,"address":"122222","emailName":"1212121","port":1222,"password":"212111","addressee":"2121211","cc":"3231231","emailInfo":"2121232321"}} postData
 * @returns
 */
export const updateEmail = (postData) => {
  return request({
    url: `/flow/emailInfo/saveOrUpdateEmailInfo`,
    method: 'post',
    data: postData,
    skipLoading: true,
  })
}
