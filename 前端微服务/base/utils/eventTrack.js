export function setEventTrack(userinfo, toRoute) {
  if (toRoute.fullPath && window._hmt && userinfo.userCode) {
    let trackCode = getTrackCode(toRoute.fullPath)
    window._hmt.push([
      '_trackPageview',
      `${window.location.pathname}#${toRoute.fullPath}@userCode=${userinfo.userCode}@$trackCode=${trackCode}$`,
    ])
  }
}

function getTrackCode(path) {
  let trackCode = ''
  let isZb = [
    '/baseManageSystem',
    '/btzbglSystem',
    '/agencySystem',
    '/checkflowSystem',
  ].some((item) => path.indexOf(item) !== -1)
  let isAppversion = ['/appVersion'].some((item) => path.indexOf(item) !== -1)
  let isInspect = ['/inspect'].some((item) => path.indexOf(item) !== -1)
  let isFileBase = ['/fileBase'].some((item) => path.indexOf(item) !== -1)
  let isIot = ['/iot'].some((item) => path.indexOf(item) !== -1)
  let isMonitor = ['/onlineMonitor'].some((item) => path.indexOf(item) !== -1)
  let isVideos = ['/videos'].some((item) => path.indexOf(item) !== -1)
  let isBigdataAnalysis = ['/bigdataAnalysis'].some(
    (item) => path.indexOf(item) !== -1
  )
  let isMsg = ['/msg'].some((item) => path.indexOf(item) !== -1)
  if (isZb) trackCode = 'zb'
  if (isAppversion) trackCode = 'appversion'
  if (isInspect) trackCode = 'inspect'
  if (isFileBase) trackCode = 'filebase'
  if (isIot) trackCode = 'iot'
  if (isMonitor) trackCode = 'monitor'
  if (isVideos) trackCode = 'videos'
  if (isBigdataAnalysis) trackCode = 'bigdataAnalysis'
  if (isMsg) trackCode = 'msg'
  return trackCode
}
