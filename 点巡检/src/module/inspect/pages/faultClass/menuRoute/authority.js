import { reject } from 'lodash'

import notFind from '@/core/components/404'
import loading from './loading.vue'

let webpackContext = require.context('../components', true, /.vue$/)

let getData = (() => {
  let gainAuthorityName = []
  let returnData = {}
  let recursionFn = function (data) {
    data.forEach((item) => {
      if (item.component) {
        gainAuthorityName.push(item.component)
      }
      if (item.children) {
        recursionFn(item.children)
      } else {
      }
    })
  }

  // console.log(indexData.keys())
  let promise = new Promise((reslove, reject) => {
    setTimeout(async () => {
      let data = await import('./index')

      recursionFn(data.default)

      let filterData = gainArray.filter((item, index) => {
        let boolean = false
        for (let i = 0; i < gainAuthorityName.length; i++) {
          let item2 = gainAuthorityName[i]
          if (item.name == item2) {
            boolean = true
            break
          }
        }

        return boolean
      })

      filterData.forEach((item, index) => {
        let componentName = item.name
        returnData[`${componentName}`] = item
      })

      reslove(returnData)
    }, 100)
  })

  return promise
})()

let dynamicComponents = {}
let gainArray = []
webpackContext.keys().forEach((key) => {
  let esModule = webpackContext(key)

  let returnObj = esModule.default

  // let copy = _.cloneDeep(returnObj)
  let componentName = returnObj.name
  gainArray.push(returnObj)

  if (returnObj.allowAccess) {
    dynamicComponents[`${componentName}`] = returnObj
  } else {
    dynamicComponents[`${componentName}`] = () => ({
      // 需要加载的组件 (应该是一个 `Promise` 对象)
      component: new Promise(async (reslove, reject) => {
        let returnData = await getData
        if (returnData[`${componentName}`]) {
          reslove(returnData[`${componentName}`])
        } else {
          reject()
        }
      }),
      // 异步组件加载时使用的组件
      loading: loading,
      // 加载失败时使用的组件
      error: notFind,
      // 展示加载时组件的延时时间。默认值是 200 (毫秒)
      delay: 200,
      // 如果提供了超时时间且组件加载也超时了，
      // 则使用加载失败时使用的组件。默认值是：`Infinity`
      timeout: 13000,
    })
  }

  // mapEn = returnObj
})

export default dynamicComponents
