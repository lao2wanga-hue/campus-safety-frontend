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
  document.title = `${to.meta.title || '首页'} - 校园安全隐患管理系统`
  const token = localStorage.getItem('token')
  
  if (to.path !== '/login' && !token) {
    next('/login')
    return
  }
  
  if (to.path === '/login' && token) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router