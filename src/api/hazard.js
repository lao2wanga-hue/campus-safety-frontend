import request from './request'

/**
 * 获取隐患列表
 */
export function getHazardList(status, level) {
  return request({
    url: '/hazard/list',
    method: 'get',
    params: { status, level }
  })
}

/**
 * 获取隐患详情
 */
export function getHazardById(id) {
  return request({
    url: `/hazard/${id}`,
    method: 'get'
  })
}

/**
 * 创建隐患
 */
export function createHazard(data) {
  return request({
    url: '/hazard',
    method: 'post',
    data
  })
}

/**
 * 更新隐患
 */
export function updateHazard(id, data) {
  return request({
    url: `/hazard/${id}`,
    method: 'put',
    data
  })
}

/**
 * 分配隐患
 */
export function assignHazard(id, handlerId) {
  return request({
    url: `/hazard/${id}/assign`,
    method: 'post',
    params: { handlerId }
  })
}

/**
 * 解决隐患
 */
export function resolveHazard(id, resolution) {
  return request({
    url: `/hazard/${id}/resolve`,
    method: 'post',
    params: { resolution }
  })
}

/**
 * 关闭隐患
 */
export function closeHazard(id) {
  return request({
    url: `/hazard/${id}/close`,
    method: 'post'
  })
}

/**
 * ⭐ 完成修理
 */
export function completeRepairApi(id) {
  return request({
    url: `/hazard/${id}/complete`,
    method: 'post'
  })
}

/**
 * ⭐ 删除隐患
 */
export function deleteHazardApi(id) {
  return request({
    url: `/hazard/${id}`,
    method: 'delete'
  })
}

/**
 * ⭐ 获取维修员列表（确保有这个函数）
 */
export function getRectifiers() {
  return request({
    url: '/hazard/rectifiers',
    method: 'get'
  })
}

/**
 * 获取处理中的隐患
 */
export function getProcessingHazards() {
  return request({
    url: '/hazard/processing',
    method: 'get'
  })
}

/**
 * 获取统计数据
 */
export function getStatistics() {
  return request({
    url: '/hazard/statistics',
    method: 'get'
  })
}

/**
 * 获取我的上报
 */
export function getMyReports() {
  return request({
    url: '/hazard/my-reports',
    method: 'get'
  })
}

/**
 * 获取我的任务
 */
export function getMyTasks() {
  return request({
    url: '/hazard/my-tasks',
    method: 'get'
  })
}