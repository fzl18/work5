/**
 * @description 导出默认网路配置
 **/
const network = {
  //配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  //最长请求时间
  requestTimeout: 10000,
  //反向代理URL
  proxyURL: 'http://129.211.173.106:6001',
}
module.exports = network
