import { storage, userInfoTableName, domain } from '@/config'
import cookie from 'js-cookie'

/**
 * 获取登录名
 * @returns
 */
export function getLoginName() {
  const userInfo = getUserInfo()
  return userInfo && userInfo.loginName ? userInfo.loginName : ''
}

export function getUserName() {
  const userInfo = getUserInfo()
  return userInfo && userInfo.userName ? userInfo.userName : ''
}

/**
 * @description 获取userInfo
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getUserInfo() {
  // return 'sdfsdfef'
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(userInfoTableName)
        ? JSON.parse(localStorage.getItem(userInfoTableName))
        : null
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(userInfoTableName)
        ? JSON.parse(sessionStorage.getItem(userInfoTableName))
        : null
    } else if ('cookie' === storage) {
      return cookie.get(userInfoTableName)
        ? JSON.parse(cookie.get(userInfoTableName))
        : null
    } else {
      return localStorage.getItem(userInfoTableName)
        ? JSON.parse(localStorage.getItem(userInfoTableName))
        : null
    }
  } else {
    return localStorage.getItem(userInfoTableName)
      ? JSON.parse(localStorage.getItem(userInfoTableName))
      : null
  }
}

/**
 * @description 存储userInfo
 * @param userInfo
 * @returns {void|*}
 */
export function setUserInfo(userInfo) {
  const userInfoStr = JSON.stringify(userInfo)
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(userInfoTableName, userInfoStr)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(userInfoTableName, userInfoStr)
    } else if ('cookie' === storage) {
      return cookie.set(userInfoTableName, userInfoStr, { domain: domain })
    } else {
      return localStorage.setItem(userInfoTableName, userInfoStr)
    }
  } else {
    return localStorage.setItem(userInfoTableName, userInfoStr)
  }
}

/**
 * @description 移除userInfo
 * @returns {void|Promise<void>}
 */
export function removeUserInfo() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(userInfoTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else if ('cookie' === storage) {
      return cookie.remove(userInfoTableName)
    } else {
      return localStorage.removeItem(userInfoTableName)
    }
  } else {
    return localStorage.removeItem(userInfoTableName)
  }
}
