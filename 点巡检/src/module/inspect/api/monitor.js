import apiCore from './config/index'

import { set } from 'lodash'

let request = apiCore.fetch
let fetchRoot = apiCore.fetchRoot
// 在线监测-接口
export default {
  // 获取输送带/部件设备分页
  getDevicePage: function (data) {
    return fetchRoot({
      url: 'monitor/monitor/am/list',
      method: 'GET',
      params: data.params,
      data: data.data,
    })
  },
  // 获取输送机分页
  getConveyorList: function (data) {
    return fetchRoot({
      url: '/monitor/monitor/am/page',
      method: 'POST',
      params: data.params,
      data: data.data,
    })
  },
  // 获取分类树
  getKindPage: function (data) {
    return fetchRoot({
      url: '/monitor/monitor/monitorKind/tree',
      method: 'POST',
      params: data.params,
      data: data.data,
    })
  }
}
