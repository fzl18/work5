import apiCore from "./api/cockpit-api";
import apiCore2 from "./api/am-app-api-mobile";
let request = apiCore.fetch;
// let request2 = apiCore2.fetch;
export function dailycheck() {
  return request({
    // url: `/chart/dailycheck`, // 今日设备点检情况
    url: `/chart/inspectioncheck?taskType=2`, // 今日设备点检情况
    method: "get",
  });
}

export function equipmentMaintain(date) {
  return request({
    url: `/chart/equipmentMaintain?date=${date}`, // 本月设备故障维修率
    method: "get",
  });
}
export function equipmentWarning(date) {
  return request({
    url: `/chart/equipmentWarning?date=${date}`, // 本月设备监测预警统计
    method: "get",
  });
}
export function inspectioncheck() {
  return request({
    url: `/chart/inspectioncheck?taskType=1`, // 今日设备巡检情况
    method: "get",
  });
}
export function inspectionLineTask(date) {
  return request({
    url: `/chart/inspectionLineTask?date=${date}`, // 本月输送线巡检任务统计
    method: "get",
  });
}
export function inspectionTask(date) {
  return request({
    url: `/chart/inspectionTask?date=${date}`, // 本月巡检任务执行趋势
    method: "get",
  });
}
export function workOrder(date) {
  return request({
    url: `/chart/workOrder?date=${date}`, // 本月工单按时完成率
    method: "get",
  });
}

export function query(userCode) {
  return request({
    url: `/config/query?userCode=${userCode}`, // 查询图表配置
    method: "get",
  });
}

export function addOrUpdate(data) {
  return request({
    url: `/config/addOrUpdate`, //新增图表配置
    method: "post",
    data,
  });
}
export function weather() {
  return request({
    url: `/config/weather`, //天气
    method: "get",
  });
}

export function getCountOfConveyor(data) {
  return request({
    url: `/chart/getCountOfConveyor`, //按输送机统计工单数量
    method: "post",
    data: { month: data },
  });
}

export function getCountOfFault(data) {
  return request({
    url: `/chart/getCountOfFault`, //按故障统计工单数量
    method: "post",
    data: { month: data },
  });
}

export function getCountOfKind(data) {
  return request({
    url: `/chart/getCountOfKind`, //按物料分类统计消耗的备品数量
    method: "post",
    data: { month: data },
  });
}
