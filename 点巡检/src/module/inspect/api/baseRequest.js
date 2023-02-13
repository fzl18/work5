// import request from '../request'
import request from '@/utils/request2'
// let baseURL = `https://test.letsco.com.cn/am-app-api-web`
// let baseURL = `${process.env.VUE_APP_URL}/am-app-api-web`
let baseURL = `/am-app-api-web`
export default request(baseURL)
