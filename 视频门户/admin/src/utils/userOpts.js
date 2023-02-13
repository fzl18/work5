import { storage, domain } from '@/config'
import cookie from 'js-cookie'

const userOptTableName = 'accessUserOpts'

/**
 * @description 获取userOpts
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getUserOpts() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(userOptTableName)
        ? JSON.parse(localStorage.getItem(userOptTableName))
        : null
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(userOptTableName)
        ? JSON.parse(sessionStorage.getItem(userOptTableName))
        : null
    } else if ('cookie' === storage) {
      return cookie.get(userOptTableName)
        ? JSON.parse(cookie.get(userOptTableName))
        : null
    } else {
      return localStorage.getItem(userOptTableName)
        ? JSON.parse(localStorage.getItem(userOptTableName))
        : null
    }
  } else {
    return localStorage.getItem(userOptTableName)
      ? JSON.parse(localStorage.getItem(userOptTableName))
      : null
  }
}

/**
 * @description 存储userOpts
 * @param userOpts
 * @returns {void|*}
 */
export function setUserOpts(userOpts) {
  const userOptsStr = JSON.stringify(userOpts)
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(userOptTableName, userOptsStr)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(userOptTableName, userOptsStr)
    } else if ('cookie' === storage) {
      return cookie.set(userOptTableName, userOptsStr, { domain: domain })
    } else {
      return localStorage.setItem(userOptTableName, userOptsStr)
    }
  } else {
    return localStorage.setItem(userOptTableName, userOptsStr)
  }
}

/**
 * @description 移除userOpts
 * @returns {void|Promise<void>}
 */
export function removeUserOpts() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(userOptTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else if ('cookie' === storage) {
      return cookie.remove(userOptTableName)
    } else {
      return localStorage.removeItem(userOptTableName)
    }
  } else {
    return localStorage.removeItem(userOptTableName)
  }
}
