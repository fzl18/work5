import fetch from '@/utils/request'
const request = fetch()

export const updateGateWaySetting = (postData) => {
  return request({
    url: `/gateway/paramDeploy/saveOrUpdateParamDeploy`,
    method: 'post',
    data: postData,
  })
}

export const syncTime = () => {
  return request({
    url: `/gateway/paramDeploy/synTime`,
    method: 'get',
  })
}

export const getGateWaySetting = () => {
  return request({
    url: `/gateway/paramDeploy/getParamDeploy`,
    method: 'get',
  })
}

export const getGateWayInfo = () => {
  return request({
    url: `/gateway/paramDeploy/nature`,
    method: 'get',
  })
}

export const reboot = () => {
  return request({
    url: `/gateway/paramDeploy/reboot`,
    method: 'get',
  })
}
