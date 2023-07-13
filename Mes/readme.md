####  项目工程

###### 安装 :

```js
npm i
```

###### 运行：

```
npm run serve
```

###### 编译与打包

     1. UAT：  npm run build:uat
     2. PROD： npm run build



一、**工程结构**图，如下：

![](img/1.jpg)



二、**package.json**记录了工程所有依赖，及脚本命令：

```
"scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "build:uat": "vue-cli-service build --mode uat",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "axios": "^0.20.0",
    "clipboard": "^2.0.6",
    "dayjs": "^1.9.1",
    "echarts": "^4.9.0",
    "element-ui": "^2.13.2",
    "js-cookie": "^2.2.1",
    "lodash": "^4.17.20",
    "nprogress": "^0.2.0",
    "qs": "^6.9.4",
    "remixicon": "^2.5.0",
    "screenfull": "^5.0.2",
    "vue": "^2.6.12",
    "vue-echarts": "^4.1.0",
    "vue-i18n": "^8.21.1",
    "vue-router": "^3.4.5",
    "vuex": "^3.5.1",
    "xlsx": "^0.16.7"
  },
```



三、**@/src/main.js** 是工程的入口文件，加载了框架核心文件。 	**@/public/index.html** 是模板文件，用来挂载js文件



四、**src目录**下存放页面及js代码。

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



五、**构建功能模块** (新页面)

所有系统项目模块，都放置在module目录下，新建项目名称文件夹，内部包含文件夹如图示：

![](img/4.jpg)

|- api					  此目录用来集中管理接口
|- components	 通用组件
|- pages				 页面文件
|- router.js			路由配置

###### 添加pages

> ###### 添加 API

基于axios封装，基础的 request 位置：utils/request.js      使用示例：

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

说明：可传入 url，如后端接口未与宝通后台接口一致，可自行基于axios封装。

​			一个文件对应一个页面。

​			如果后台未处理跨域，则需要在根目录下，找到 vue.config.js  55行，proxy字段中配置反向代理。

> ###### 添加路由

路由写在router.js文件中，随后添加到主路由中，位于：/src/router/index.js  `可参考demoSystem中的 router.js`

开发时需在配置文件 @/config/config.js   中配置字段 `loginInterception: false`  使用本地路由模式

路由结构：

```
[{
  path: '/login'					  URL地址，路径名 规则： '/子系统名/页面名'
  component: () => import('@/module/子系统/pages/page.vue')  页面加载
  hidden:true                         是否显示在菜单中显示路由（默认值：false）
  alwaysShow:false                    当只有一级子路由时是否显示父路由是否显示在菜单中显示路由（默认值：false）
  name:"Name"                         首字母大写，一定要与vue文件的name对应起来，用于noKeepAlive缓存控制
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



> ###### 使用 VUEX

如果有全局通讯数据，需要用到vuex，可以在@/stroe文件夹内，`创建以子系统名为目录的文件夹，子系统的全局通讯数据都放置在此文件夹内`，避免与其它系统合并时发生冲突。调用时，以文件夹名为前缀，驼峰式 调用示例：

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

> ###### 添加国际化

采用 vue-i18n 三方库，框架封装了方法 `translateTitle` 文件位置：`/src/utils/i18n`

使用示例：

```
 import { translateTitle } from '@/utils/i18n'
 
 <span> {{translateTitle('名称')}} </span>
```

对应 国际化的文件，位置: `/src/i18n/` 目录， 翻译文件 JSON 格式 { 名称：值 } ，如： `key:value`

> ###### 使用图标

基础图标引入了三方库：remixicon  官网：https://remixicon.com/  图标的使用 示例：

```
<remix-icon icon-class="logout-circle"></remix-icon>
```

icon-class的值为 图标对应的值，可在官网查看，**注意**: 不需要前缀`ri-`

*如果需要添加自定义的图标，可以将图标导出为svg格式，放置到 @/icon/remixIcon 目录下，即可使用，icon-class值为文件名。*

示例：注意需要添加 `is-svg`

```
<remix-icon icon-class="logout-circle" is-svg />
```



#### 开发规范说明

1 所有页面风格必须统一，相同功能用同一组件，方便维护。

2 组件级样式写在组件内部，必须要用局部关键词： `scoped`，避免污染全局。

3 使用 es6 风格进行编码，解构赋值，箭头函数。

4 每个页面（有路由地址的）都需要有单独的目录文件夹，必须与路由名一至，驼峰命名

5 v-for 遍历的时候，总是应该带上 key 值，v-for 应该避免与 v-if 在同一个元素（例如：`<li>`）上使用。

6 重要的代码块务必添加注释。

7 页面需要自适应宽度，高度不做要求。

#### 常见问题

1. 修改默认配置文件后不生效 ？

   > 注意查看是否在 `@/config/config.js` 中有相关设置，会覆盖默认设置。

2. 本地开发如何不走 cas 登录，菜单如何生成？

   > 在配置文件中 把 `loginInterception` 字段设置成 `false`，菜单即路由，本地路由可以在@/route/index.js 文件中进行添加

3. 关于页面内的滚动条

   > 可以使用 `<el-scrollbar>` 组件进行包装

#### 关于开发工具

推荐使用 vscode 工具，在保存时可对代码自动进行格式化处理，提交 git 时会进行 eslint 代码检查。







