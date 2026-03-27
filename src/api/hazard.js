import request from './request'

export function getHazardList(status, level) {
  return request({
    url: '/hazard/list',
    method: 'get',
    params: { status, level }
  })
}

export function getHazardById(id) {
  return request({
    url: `/hazard/${id}`,
    method: 'get'
  })
}

export function createHazard(data) {
  return request({
    url: '/hazard',
    method: 'post',
    data
  })
}

export function updateHazard(id, data) {
  return request({
    url: `/hazard/${id}`,
    method: 'put',
    data
  })
}

export function assignHazard(id, handlerId) {
  return request({
    url: `/hazard/${id}/assign`,
    method: 'post',
    params: { handlerId }
  })
}

export function resolveHazard(id, resolution) {
  return request({
    url: `/hazard/${id}/resolve`,
    method: 'post',
    params: { resolution }
  })
}

export function closeHazard(id) {
  return request({
    url: `/hazard/${id}/close`,
    method: 'post'
  })
}

export function getStatistics() {
  return request({
    url: '/hazard/statistics',
    method: 'get'
  })
}

export function getMyReports() {
  return request({
    url: '/hazard/my-reports',
    method: 'get'
  })
}

export function getMyTasks() {
  return request({
    url: '/hazard/my-tasks',
    method: 'get'
  })
}