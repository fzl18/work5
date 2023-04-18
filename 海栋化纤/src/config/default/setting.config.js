/**
 * @description 导出默认通用配置
 */
const setting = {
  //开发以及部署时的URL，hash模式时在不确定二级目录名称的情况下建议使用""代表相对路径或者"/二级目录/"，history模式默认使用"/"或者"/二级目录/"
  publicPath: '',
  //生产环境构建文件的目录名
  outputDir: 'dist',
  //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  //开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  //进行编译的依赖
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  //默认的接口地址 如果是开发环境和生产环境走mock-server，当然你也可以选择自己配置成需要的接口地址
  baseURL: '/mgr',
  //标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: '江苏海栋化纤',
  //标题分隔符
  titleSeparator: ' - ',
  //标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
  titleReverse: false,
  //项目简写
  abbreviation: '',
  //开发环境端口号
  devPort: '9527',
  //版本号
  version: process.env.VUE_APP_VERSION,
  //底部copyright
  copyright: '钜网中国',
  //缓存路由的最大数量
  keepAliveMaxNum: 99,
  //路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  //不经过token校验的路由白名单
  routesWhiteList: ['/login', '/register', '/callback', '/404', '/403'],
  //加载时显示文字
  loadingText: '正在加载中...',
  //token名称 xhr 中 header头定义名
  tokenName: 'Authorization',
  //token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'accessToken',
  //token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  //是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称
  logo: 'vuejs-fill',
  //语言类型zh、en
  i18n: 'zh',
  //消息框消失时间
  messageDuration: 3000,
  //在哪些环境下显示高亮错误
  errorLog: ['development', 'production'],
  //是否开启登录拦截 开发时可以关闭，不走登录
  loginInterception: false,
  //是否开启三方单点登录
  sso: false,
  //单点登录跳转地址 需sso开启，如由接口返回则为空
  ssoUrl: '',
  //frontEnd（前端导出路由）和 server（后端导出路由）两种方式
  authentication: 'frontEnd',
  //是否开启roles字段进行角色权限控制（如果是server模式后端完全处理角色并进行json组装，可设置false不处理路由中的roles字段）
  rolesControl: false,
  //vertical gallery comprehensive common布局时是否只保持一个子菜单的展开
  uniqueOpened: true,
  //vertical布局时默认展开的菜单path，使用逗号隔开建议只展开一个
  defaultOpeneds: ['/core'],
  //需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  //需要自动注入并加载的模块
  providePlugin: {},
  //npm run build时是否自动生成7z压缩包
  build7z: false,
  //画廊布局和综合布局时，是否点击一级菜单默认开启第一个二级菜单
  openFirstMenu: true,
}
module.exports = setting
