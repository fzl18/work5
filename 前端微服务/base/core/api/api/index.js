import fetch2 from '@/utils/request2'

let request = fetch2('/')
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
}
