/**
 * @description 自定义配置，用来覆盖默认配置
 **/
const config = {
  loginInterception: true, // dev时关闭登录拦截
  devPort: '7002', //服务端口
  proxyURL: process.env.VUE_APP_PROXY_URL || 'http://192.168.136.122:8730', //代理地址
}
module.exports = config
