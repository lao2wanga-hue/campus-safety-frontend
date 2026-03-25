import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: () => import('@/views/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'DataAnalysis' }
      },
      {
        path: 'hazard/list',
        name: 'HazardList',
        component: () => import('@/views/HazardList.vue'),
        meta: { title: '隐患列表', icon: 'List' }
      },
      {
        path: 'hazard/detail/:id',
        name: 'HazardDetail',
        component: () => import('@/views/HazardDetail.vue'),
        meta: { title: '隐患详情', hidden: true }
      },
      {
        path: 'hazard/report',
        name: 'HazardReport',
        component: () => import('@/views/HazardReport.vue'),
        meta: { title: '上报隐患', icon: 'CirclePlus' }
      },
      {
        path: 'user/manage',
        name: 'UserManage',
        component: () => import('@/views/UserManage.vue'),
        meta: { title: '用户管理', icon: 'User', roles: ['ADMIN'] }
      }
    ]
  }
]

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '首页'} - 校园安全隐患管理系统`
  
  const token = localStorage.getItem('token')
  
  console.log('=== 路由守卫 ===')
  console.log('目标路径:', to.path)
  console.log('token:', token)
  
  // 如果没有 token 且不是登录页，跳转到登录
  if (to.path !== '/login' && !token) {
    console.log('无 token，跳转到登录')
    next('/login')
    return
  }
  
  // 如果有 token 且在登录页，跳转到首页
  if (to.path === '/login' && token) {
    console.log('已有 token，跳转到首页')
    next('/dashboard')
    return
  }
  
  console.log('允许访问')
  next()
})

export default router