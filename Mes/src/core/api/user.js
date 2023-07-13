import fetch from '@/utils/request'
import { tokenName } from '@/config'

let request = fetch()

export async function ssoLogin() {
  return request({
    url: '/auth/login',
    method: 'post',
  })
}

export function logout(params) {
  return request({
    url: '/auth/logout',
    method: 'get',
    params,
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
