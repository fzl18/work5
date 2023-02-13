import request from './baseRequest'
//基础数据管理
//获取基础数据列表
export const getBaseInfoOptionList = (data) => request.get('/option/list', data)

//批量更新基础数据
export const baseOptionListUpdate = (data) =>
  request.post('/option/updateList', data)
