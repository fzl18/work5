import fetch from '@/utils/request'
const request = fetch()

export const getTypes = (typeName) => {
  return request({
    url: `/arg/dictionary/queryDictionaryByTypeName/${typeName}`,
    method: 'get',
    skipLoading: true,
  })
}
