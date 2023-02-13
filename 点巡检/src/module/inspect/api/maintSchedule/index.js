import request from '../../request'

const http = request('/am-app-api-web')

//
export const listWorkOrderByFilters = (filters) => {
  return http.post('/workOrder/workOrderTodoCalendarList', filters)
}
