import fetch from '@/utils/request'
import { tokenName } from '@/config'

let request = fetch()

export async function ssoLogin() {
  return request({
    url: '/vportal/auth/login',
    method: 'post',
  })
}

export function logout(url) {
  return request({
    url: `/vportal/auth/logout?returnUrl=${url}`,
    method: 'get',
  })
}

export function register() {
  return request({
    url: '/vportal/register',
    method: 'post',
  })
}
