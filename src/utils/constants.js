export const HAZARD_LEVELS = [
  { value: 'NORMAL', label: '普通', type: 'info' },
  { value: 'HIGH', label: '高', type: 'warning' },
  { value: 'URGENT', label: '紧急', type: 'danger' }
]

export const HAZARD_STATUS = [
  { value: 'PENDING', label: '待处理', type: 'warning' },
  { value: 'ASSIGNED', label: '已分配', type: 'primary' },
  { value: 'RECTIFYING', label: '整改中', type: 'success' },
  { value: 'COMPLETED', label: '已完成', type: 'success' },
  { value: 'REJECTED', label: '已拒绝', type: 'info' }
]

export const USER_ROLES = [
  { value: 'ADMIN', label: '管理员' },
  { value: 'REPORTER', label: '上报人' },
  { value: 'RECTIFIER', label: '整改人' }
]