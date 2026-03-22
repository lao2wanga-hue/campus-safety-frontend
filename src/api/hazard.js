import request from './request'

export function getHazardList(params) {
  return request({
    url: '/hazard/list',
    method: 'get',
    params
  })
}

export function getHazardDetail(id) {
  return request({
    url: `/hazard/detail/${id}`,
    method: 'get'
  })
}

export function reportHazard(data) {
  return request({
    url: '/hazard/report',
    method: 'post',
    data
  })
}

export function assignHazard(data) {
  return request({
    url: '/hazard/assign',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/hazard/status',
    method: 'post',
    data
  })
}

export function getStatistics() {
  return request({
    url: '/hazard/stats',
    method: 'get'
  })
}

export function deleteHazard(id) {
  return request({
    url: `/hazard/${id}`,
    method: 'delete'
  })
}