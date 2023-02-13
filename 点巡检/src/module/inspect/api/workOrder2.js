import apiCore from './config/index'

import { set } from 'lodash'

let request = apiCore.fetch

export default {

  exportExcel: function exportExcel(id) {
    return request({
      url: `/workOrder/exportExcel?id=${id}`,
      method: 'POST',
      responseType: 'arraybuffer',
      resType: 'all',
    })
  },
}
