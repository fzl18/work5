/**
 * @description 导出默认request配置
 **/
const network = {
  //配后端数据的接收方式application/json;charset=UTF-8 或 application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  //最长请求时间
  requestTimeout: 5000,
  //反向代理URL
  proxyURL: 'https://10.11.8.5:8080',
  // 设置cookie的有效作用域
  domain: '',
}
module.exports = network
