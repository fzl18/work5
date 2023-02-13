import fetch2 from '@/utils/request2'

let request = fetch2('/purchase')

let request2 = fetch2()
export default {
  fetch: function (data) {
    return request(data)
    // return new Promise((resolve, reject) => {
    //   request(data)
    //     .then((...array) => {
    //       resolve(...array)
    //     })
    //     .catch((...array) => {})
    // })
  },
  fetchRoot: function (data) {
    return request2(data)
    // return new Promise((resolve, reject) => {
    //   request(data)
    //     .then((...array) => {
    //       resolve(...array)
    //     })
    //     .catch((...array) => {})
    // })
  },
}
