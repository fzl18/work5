### 概述：

> 前端框架主要为应用系统的中后台管理，提供了统一风格的 UI，集成实现了基础功能，统一规范。

框架主要实现功能：集成 cas 实现 sso，api 动态路由生成(开发时可自由切换成本地)，鉴权及页面级资源加载，应用报错处理，载加过渡等，提供通用组件的统一封装，常用工具函数等必备功能，免去开发时重复的相同工作。

### 框架技术栈：

> 框架基于 vue-cli3(v4.5.6)脚手架搭建，采用的技术栈：

 **VUE 全家桶**

- [x] vue 版本号：2.6.12

- [x] vuex 版本号：3.5.1

- [x] vue-router 版本号：3.4.5

- [x] vue-i18n 版本号：8.21.1

  **基础 UI 库**

- [x] element-ui 版本号：2.13.2

  **其它主要工具库**

- [x] lodash 版本号：4.17.20

- [x] js-cookie 版本号：2.2.1

- [x] axios 版本号：0.20.0

## 安装 :

```js
npm i
```

## 运行：

```
npm run serve
```

## 编译与打包

     1. UAT：  npm run build:uat
     2. PROD： npm run build

## 开发说明

> #### 集成 CAS

框架已集成 cas 登录，页面资源鉴权等功能，方便快速开发。

登录过程简介：浏览器输入网址后打开网站，加载 完 js 文件，首先会检查本地是否有 token

1.  **没有**： 跳转登录页正常登录后拿到 ticket 去请求子系统 token，成功后跳转到原访问网址。

2.  **有**： (1). `未过期`：从 api 接口拿此用户的权限路由菜单，动态添加到已有路由上，更新菜单。

 (2).`过期`：走流程 1

> #### 配置文件

位置：/src/config/ 目录
默认设置(default)共分三个文件，分别对应，网络设置(net.config.js)，应用设置(setting.config.js)，布局设置(theme.config.js)
其中 config.js 为 自定义设置文件，其权重最高，会覆盖默认设置中的设定
参数说明：详见文件内注解说明


路由结构：

```
[{
  path: '/login'					  URL地址
  component: () => import('@/index')  页面加载
  hidden:true                         是否显示在菜单中显示路由（默认值：false）
  alwaysShow:false                    当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
  name:"Demo"                         首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制
  redirect: '/index'				  如果是目录可填写 跳转URL地址
  meta:{
    title:"title"                     菜单、面包屑、多标签页显示的名称
    target: '_blank',                 外链打开方式
    remixIcon:""                      remix图标
    noKeepAlive:true                  当前路由是否不缓存（默认值：false）
    affix:true                        当前路由是否固定多标签页
    tagHidden:true                    当前路由是否不显示多标签页
  },
  children:[						  子菜单，结构同上
  {
      path: 'index',
      name: 'Index',
      component: () => import('@/views/index'),
      meta: {
          title: '首页',
          remixIcon: 'home-4-line',
          affix: true,
      },
   },
  ]
}]

//更多详见 router.js 文件内注解说明
```

> #### 新增页面

所有新页面的添加位置：/src/view/ 目录内

规范说明：以页面为目录名，新建目录，所有该页面的相关的界面或功能文件都放置在该目录文件夹下。如果需要细分组件，可新建 components 文件夹

> #### 页面资源鉴权

方法：使用全局的 v-hasPageSource 指令传入鉴权的 resCode 码 示例:

```
<div v-hasPageSource='res001'> </div>
```

'res001' 为资源接口取到的值，在用户管理系统后台中添加对应值。



> #### 关于VUEX

如果有全局通讯数据，需要用到vuex，可以在stroe文件夹内，`创建以子系统名为目录的文件夹，子系统的全局通讯数据都放置在此文件夹内`，避免与其它系统合并时发生冲突。调用时，以文件夹名为前缀，驼峰式 调用示例：

```
// xxx.vue   某个vue文件中使用

import { mapGetters, mapActions, } from 'vuex'

// 例如 stroe 目录中 新建了 core 文件夹，要调用文件 settings.js 、tabsBar.js 中的state 则可以
 computed: {
   ...mapGetters({
        visitedRoutes: 'coreTabsBar/visitedRoutes',
        device: 'coreSettings/device',
   }),
 }
// 要调用文件 settings.js 中的 action 则可以 
 methods: {
      ...mapActions({
        changeLanguage: 'coreSettings/changeLanguage',
      }),
 }
 
 // 或者直接用dispatch
 this.$store.dispatch('coreSettings/changeLanguage')
```



> #### 关于 API

基于axios封装文件了公共文件 request 位置：utils/request.js      使用示例：

```
// api.js    某页面目录内写api.js
import fetch from '@/utils/request'		//导入 request 方法

let request = fetch()                   //可传入url
//get 请求
export async function getPageResource(params) {
  return request({
    url: '/index/pageResource',
    method: 'get',
    params,
  })
}

//post 请求
export async function login(data) {		
 return request({
  url: '/auth/home',
  method: 'post',
  data,
 })
}

// xxx.vue  某页面vue文件内使用
import {getPageResource, login} from './api'   导入api内

const pageResource = await getPageResource()
const userInfo = await login()

```

规范说明：接口

> #### 关于国际化

采用 vue-i18n 三方库，封装了方法 `translateTitle` 文件位置：`/src/utils/i18n`

使用示例：

```
 <span> {{translateTitle('名称')}} </span>
```

对应 国际化的文件，位置: `/src/i18n/` 目录， 翻译文件 JSON 格式 { 名称：值 } ，如： `key:value`

> #### 关于图标

基础图标引入了三方库：remixicon 官网：https://remixicon.com/ 图标的使用 示例：

```
<remix-icon icon-class="logout-circle"></remix-icon>
```

icon-class 的值为 图标对应的值，可在官网查看，**注意**: 不需要前缀`ri-`

_如果需要添加自定义的图标，可以将图标导出为 svg 格式，放置到 @/icon/remixIcon 目录下，即可使用，icon-class 值为文件名。_

## 框架结构说明

```
Src:
		|— assets				资源目录
			|— images			本地图片资源
			|— style			放置css、sass、less 文件			
		|— icon					图标文件夹
			|- remixIcon		remixicon图标
		|— config	      		全局配置 如 baseUrl  分页数，title，默认配置等
		|— core					框架核心
			|— layouts			框架布局
			|— api				接口管理
			|— components		框架组件
			|- plugins			框架功能扩展目录
			|- styles			框架样式文件目录
		|— components           通用组件库或三方组件库封装	
		|— modules				app的各子系统模型
			|- 子系统项目
            	|- api			接口管理
            	|- components	子系统通用组件
            	|- pages		页面文件
            	|- router.js	子系统路由
		|— router				路由目录
			|- index.js			前端主路由
		|— store				vuex 全局变量
			|— module  			模块目录，按页面功能模块起名
			|— index.js			
		|— i18n					国际化目录
		|— index.js     		配置入口
		|— utils				封装函数工具类

```

## 开发规范说明

所有页面风格必须统一，相同功能用同一组件，方便维护。

组件级样式写在组件内部，必须要用局部关键词： `scoped`，避免污染全局。

使用 es6 风格进行编码，解构赋值，箭头函数

每个页面（有路由地址的）都需要有单独的目录文件夹，必须与路由名一至，驼峰命名

v-for 遍历的时候，总是应该带上 key 值，v-for 应该避免与 v-if 在同一个元素（例如：`<li>`）上使用，因为

v-for 的优先级比 v-if 更高，为了避免无效计算和渲染，应该尽量将 v-if 放到容器的父元素之上。

重要的代码块务必添加注释

### 常见问题

1. 修改默认配置文件后不生效 ？

   > 注意查看是否在 `@/config/config.js` 中有相关设置，会覆盖默认设置。


3. 关于页面内的滚动条

   > 可以使用 `<el-scrollbar>` 组件进行包装

### 关于开发工具

推荐使用 vscode 工具，在保存时可对代码自动进行格式化处理，提交 git 时会进行 eslint 代码检查。

### 未来迭代计划

完善框架，完善工具链，完成脚手架工具
