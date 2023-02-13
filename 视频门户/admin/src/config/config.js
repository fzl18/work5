/**
 * @description 自定义配置，用来覆盖默认配置
 **/
const config = {
  loginInterception: true, // dev时关闭登录拦截
  devPort: '10002', //服务端口
  proxyURL: process.env.VUE_APP_PROXY_URL || 'http://127.0.0.1', //代理地址
}
module.exports = config
