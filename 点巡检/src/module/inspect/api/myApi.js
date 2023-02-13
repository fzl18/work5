import request from './baseRequest'

//获取用户权限
export const getListUserPerm = async (data) =>
  request.post('/main/listUserPerm', data)

//role
//获取角色列表
export const roleList = ({ pageSize, pageNum, nameLike = '' }, data) => {
  let str = nameLike ? `&nameLike=${nameLike}` : ''
  return request.get(
    `/role/pageRole?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}

//查询用户权限列表
export const getUserRoleList = (data) =>
  request.post('/role/listProdPerm', data)

//查询角色信息
export const getRoleById = async ({ id }, data) =>
  request.get(`/role/getRole?roleId=${id}`, data)

//新增角色
export const createNewRole = (data) => request.post('/role/saveRole', data)

//更新角色
export const updateRole = (data) => request.post('/role/updateRole', data)

//删除角色
export const deleteRole = ({ id }, data) =>
  request.post(`/role/removeRole?roleId=${id}`, data)

//userInfo
//获取权限列表
export const permissionList = (data) =>
  request.post('/userInfo/listUserPermission', data)

//分配权限
export const assignPermission = (data) =>
  request.post('/userInfo/changeRole', data)

//获取用户列表
export const getUserList = async (
  { pageSize, pageNum, nameLike = '' },
  data
) => {
  let str = nameLike ? `&nameLike=${nameLike}` : ''
  return request.get(
    `/userInfo/pageUserInfo?pageSize=${pageSize}&pageNum=${pageNum}${str}`,
    data
  )
}

//创建用户
export const createNewUser = (data) =>
  request.post('/userInfo/saveUserInfo', data)

//查询用户信息
export const getUserInfo = async ({ id }, data) =>
  request.get(`/userInfo/getUserInfo?userId=${id}`, data)

//更新用户信息
export const updateUserInfo = (data) =>
  request.post('/userInfo/updateUserInfo', data)

//重置用户密码
export const resetUserPassword = ({ id, password }, data) =>
  request.post(`/userInfo/resetPassword?newPass=${password}&userId=${id}`)

//删除用户
export const deleteUserInfo = ({ id }, data) =>
  request.post(`/userInfo/removeUserInfo?userId=${id}`, data)

//dept
//获取部门列表
export const getDeptList = ({ id }, data) =>
  request.get(`/dept/listDept?parentId=${id}`, data)

//创建同级部门
export const createPeerDept = ({ id, name }, data) =>
  request.post(`/dept/saveDept?id=${id}&name=${name}`, data)

//创建下级部门
export const createSubDept = ({ id, name }, data) =>
  request.post(`/dept/saveSubDept?id=${id}&name=${name}`, data)

//更新部门信息
export const updateDept = ({ id, name }) =>
  request.post(`/dept/updateDept?id=${id}&name=${name}`)

//删除部门信息
export const deleteDept = ({ id }) => request.post(`/dept/removeDept?id=${id}`)

//设备类型
//获取所有设备类型
export const getAllDeviceType = ({ pageNum, pageSize }, data) =>
  request.get(
    `/equipmentType/page?pageNum=${pageNum}&pageSize=${pageSize}`,
    data
  )

export const getAllDeviceTypeList = () => request.get(`/equipmentType/list`)

//添加设备类型
export const addNewDeviceType = (data) =>
  request.post('/equipmentType/save', data)

//删除设备类型
export const deleteDeviceType = ({ id }, data) =>
  request.post(`/equipmentType/delete?id=${id}`, data)

//更新设备类型
export const updateDeviceType = (data) =>
  request.post('/equipmentType/update', data)

//设备
//获取设备列表
export const getAllDevices = async (
  {
    isPointPolling,
    deptId,
    equipmentName,
    equipmentTypeId,
    factoryDistrictId,
    pageNum,
    pageSize,
    usageState,
  },
  data
) => {
  let str = ''
  if (typeof isPointPolling == 'boolean') {
    str += isPointPolling ? `&isPointPolling=true` : `&isPointPolling=false`
  }
  str += deptId ? `&deptId=${deptId}` : ''
  str += equipmentName ? `&equipmentName=${equipmentName}` : ''
  str += equipmentTypeId ? `&equipmentTypeId=${equipmentTypeId}` : ''
  str += factoryDistrictId ? `&factoryDistrictId=${factoryDistrictId}` : ''
  str += usageState ? `&usageState=${usageState}` : ''
  return request.get(
    `/equipment/page?pageNum=${pageNum}&pageSize=${pageSize}${str}`,
    data
  )
}

//验证设备编号
export const checkDeviceNo = async ({ code, id }, data) => {
  let str = ''
  str += id ? `&id=${id}` : ''
  return request.get(`/equipment/checkNo?equipmentNo=${code}${str}`, data)
}

//获取设备详情
export const getDeviceInfoById = async ({ id }, data) =>
  request.get(`/equipment/get?id=${id}`, data)

//添加设备
export const addNewDevice = (data) => request.post('/equipment/save', data)

//更新设备
export const updateDevice = (data) => request.post('/equipment/update', data)

//删除设备
export const deleteDevice = ({ id }, data) =>
  request.post(`/equipment/delete?id=${id}`, data)

//点巡检

//设备二维码
export const getDeviceCode = ({ id }) =>
  request.get(`/equipment/qrCode?id=${id}`, { responseType: 'arraybuffer' })

//获取工厂列表
export const getFactoryListPage = ({ pageSize, pageNum, factoryName = '' }) => {
  let str = factoryName ? `&factoryName=${factoryName}` : ''
  return request.get(
    `/factory/page?pageSize=${pageSize}&pageNum=${pageNum}${str}`
  )
}

//???
export const getFactoryList = () => request.get('/factory/listFactory')

//获取作业区列表
export const getWorkSpacePage = async ({
  factoryId,
  name,
  pageNum = 1,
  pageSize = 10,
}) => {
  let str = name ? `&name=${name}` : ''
  str += factoryId ? `&factoryId=${factoryId}` : ''
  return request.get(
    `/factory/listWorkSpace?pageNum=${pageNum}&pageSize=${pageSize}${str}`
  )
}

export const getWorkSpacePageList = async () =>
  request.get('/factory/listWorkSpace')

//输送线 productLine
export const getProductLineList = async ({
  pageSize = 10,
  pageNum = 1,
  name,
  workSpaceId,
}) => {
  let str = name ? `&name=${name}` : ''
  str += workSpaceId ? `&workSpaceId=${workSpaceId}` : ''
  return request.get(
    `/factory/listProductLine?pageSize=${pageSize}&pageNum=${pageNum}${str}`
  )
}

export const getPrdLineList = async () =>
  request.get('/factory/listProductLine')

//输送带 belt
export const getBeltList = async ({
  pageSize = 10,
  pageNum = 1,
  name,
  coveryLineId,
}) => {
  let str = name ? `&name=${name}` : ''
  str += coveryLineId ? `&coveryLineId=${coveryLineId}` : ''
  return request.get(
    `/factory/listBelt?pageSize=${pageSize}&pageNum=${pageNum}${str}`
  )
}
