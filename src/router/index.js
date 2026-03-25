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
        meta: { title: '仪表盘' }
      },
      {
        path: 'hazard/list',
        name: 'HazardList',
        component: () => import('@/views/HazardList.vue'),
        meta: { title: '隐患列表' }
      },
      {
        path: 'hazard/report',
        name: 'HazardReport',
        component: () => import('@/views/HazardReport.vue'),
        meta: { title: '上报隐患' }
      },
      {
        path: 'hazard/detail/:id',
        name: 'HazardDetail',
        component: () => import('@/views/HazardDetail.vue'),
        meta: { title: '隐患详情', hidden: true }
      },
      {
        path: 'user/manage',
        name: 'UserManage',
        component: () => import('@/views/UserManage.vue'),
        meta: { title: '用户管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('=== 路由守卫 ===')
  console.log('从:', from.path)
  console.log('到:', to.path)
  console.log('token:', localStorage.getItem('token'))
  
  const token = localStorage.getItem('token')
  
  if (to.path !== '/login' && !token) {
    console.log('无 token，跳转到登录')
    next('/login')
    return
  }
  
  if (to.path === '/login' && token) {
    console.log('已有 token，跳转到首页')
    next('/dashboard')
    return
  }
  
  console.log('允许访问')
  next()
})

export default router