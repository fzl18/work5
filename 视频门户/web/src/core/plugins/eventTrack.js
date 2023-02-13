import { trackCode } from '@/config'
import store from '@/store'

export function setEventTrack(toRoute) {
  const userCode = store.getters['coreUser/loginName']
  if (toRoute.fullPath && window._hmt && trackCode != '' && userCode) {
    // console.log('---track push---')
    window._hmt.push([
      '_trackPageview',
      `${window.location.pathname}#${toRoute.fullPath}@jobCode=${userCode}@$trackCode=${trackCode}$`,
    ])
  }
}
