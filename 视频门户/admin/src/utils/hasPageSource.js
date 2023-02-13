import router from '@/router'
import _ from 'lodash'
export function hasPageSource(soruceCode, key = 'resCode') {
  let { pageResource } = router.currentRoute.meta
  if (soruceCode && _.find(pageResource, [key, soruceCode])) {
    return true
  }
  return false
}
