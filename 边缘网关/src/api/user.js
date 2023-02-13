import fetch from '@/utils/request'
const request = fetch()

export const login = (username, password) => {
  // return request({
  //   url: '/api/user/login',
  //   method: 'post',
  //   data: {
  //     username,
  //     password,
  //   },
  // })

  // const formData = new FormData()
  // formData.append('username', username)
  // formData.append('password', password)
  // return request({
  //   url: `/api/user/login`,
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'application/json;charset=UTF-8',
  //   },
  //   data: formData,
  // })
  return request({
    url: `/api/user/login?username=${username}&password=${password}`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
}

export const getUserInfo = () => {
  return request({
    url: '/getUserInfo',
    method: 'post',
  })
}
