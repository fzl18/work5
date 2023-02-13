import fetch from '@/utils/request'
const request = fetch()

export const getLogList = (params) => {
  const page = {
    pageNum: 1,
    pageSize: 20,
  }
  return request({
    url: `/log/flowErrorLog/queryFlowLog`,
    method: 'post',
    data: Object.assign({}, page, params),
  })
}
