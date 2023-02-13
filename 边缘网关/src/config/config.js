/**
 * @description 自定义配置，用来覆盖默认配置
 **/
const config = {
  devPort: '9999', //服务端口
  //路由模式，可选值为 history 或 hash
  indexPath: process.env.VUE_APP_INDEXPATH || 'index.html',
  publicPath: process.env.VUE_APP_PUBLICPATH,
  assetsDir: 'static',
  baseURL: process.env.VUE_APP_BASEAPI || '/api',
  routerMode: 'hash',
  proxyURL: process.env.VUE_APP_PROXY_URL || 'http://127.0.0.1', //代理地址
  tokenName: 'token',
  requestTimeout: 1000 * 30,
  title: '边缘网关',
  logo: 'bt_logo',
  apiWhiteList: ['/login', '/image/imgUpload'], //不校验token的接口地址
  pageWhiteList: ['/login', '/404'], //不校验token的页面地址
}
module.exports = config
