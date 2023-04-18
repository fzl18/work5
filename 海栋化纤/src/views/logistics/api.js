import request from '@/utils/request'

export function login(data) {
  //登录
  return request({
    url: 'mindex/login',
    method: 'post',
    data,
  })
}
export function logout(data) {
  //登出
  return request({
    url: 'mindex/logout',
    method: 'post',
    data,
  })
}
export function getMenu(data) {
  //菜单
  return request({
    url: 'mindex/menu',
    method: 'post',
    data,
  })
}

//==================== 送货申请单
export function userAll(data) {
  //列表
  return request({
    url: 'busrwaybill/user_all',
    method: 'post',
    data,
  })
}
export function applyAll(data) {
  //列表
  return request({
    url: 'busrwaybill/all',
    method: 'post',
    data,
  })
}
export function applyList(data) {
  //列表
  return request({
    url: 'busrwaybill/all',
    method: 'post',
    data,
  })
}
export function applyAdd(data) {
  //添加
  return request({
    url: 'busrwaybill/add',
    method: 'post',
    data,
  })
}
export function applyEdit(data) {
  //编辑
  return request({
    url: 'busrwaybill/edit',
    method: 'post',
    data,
  })
}
export function applyDel(data) {
  //删除
  return request({
    url: 'busrwaybill/del',
    method: 'post',
    data,
  })
}

// 审核 ===================================
export function checkList(data) {
  //列表
  return request({
    url: 'checkapproval/index',
    method: 'post',
    data,
  })
}
export function checkEdit(data) {
  //编辑
  return request({
    url: 'checkapproval/edit',
    method: 'post',
    data,
  })
}
export function checkDel(data) {
  //编辑
  return request({
    url: 'checkapproval/del',
    method: 'post',
    data,
  })
}

// 出库单 ================================
export function busoutboundList(data) {
  //列表
  return request({
    url: 'busoutbound/index',
    method: 'post',
    data,
  })
}
export function busdelivRwayList(data) {
  //列表2
  return request({
    url: 'busdeliv/rwayList',
    method: 'post',
    data,
  })
}
export function busoutboundEdit(data) {
  //编辑
  return request({
    url: 'busoutbound/edit',
    method: 'post',
    data,
  })
}
export function busoutboundDel(data) {
  //删除
  return request({
    url: 'busoutbound/del',
    method: 'post',
    data,
  })
}
// 送货单 ================================
export function busdelivIndex(data) {
  //列表
  return request({
    url: 'busdeliv/index',
    method: 'post',
    data,
  })
}
export function busdelivEdit(data) {
  //编辑
  return request({
    url: 'busdeliv/edit',
    method: 'post',
    data,
  })
}
export function busdelivDel(data) {
  //删除
  return request({
    url: 'busdeliv/del',
    method: 'post',
    data,
  })
}
// 出门证 ================================
export function busppIndex(data) {
  //列表
  return request({
    url: 'buspp/index',
    method: 'post',
    data,
  })
}
export function busppEdit(data) {
  //编辑
  return request({
    url: 'buspp/edit',
    method: 'post',
    data,
  })
}
export function busppDel(data) {
  //删除
  return request({
    url: 'buspp/del',
    method: 'post',
    data,
  })
}
// 退货单 ================================
export function busrtnIndex(data) {
  //列表
  return request({
    url: 'busrtn/index',
    method: 'post',
    data,
  })
}
export function busrtnEdit(data) {
  //编辑
  return request({
    url: 'busrtn/edit',
    method: 'post',
    data,
  })
}
export function busrtnDel(data) {
  //删除
  return request({
    url: 'busrtn/del',
    method: 'post',
    data,
  })
}

export function buscusIndex(data) {
  //客户与运输公司表列表
  return request({
    url: 'buscus/index',
    method: 'post',
    data,
  })
}
export function buslogisticsEdit(data) {
  // 物流信息编辑
  return request({
    url: 'buslogistics/edit',
    method: 'post',
    data,
  })
}
export function buslogisticsDel(data) {
  //物流信息删除
  return request({
    url: 'buslogistics/del',
    method: 'post',
    data,
  })
}
