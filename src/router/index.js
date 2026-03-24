import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',  // ⭐ 新增注册路由
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
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
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'  // ⭐ 未登录重定向到登录页
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '首页'} - 校园安全隐患管理系统`
  
  const userStore = useUserStore()
  const token = userStore.token
  
  // 注册和登录页面不需要 token
  if (to.path === '/login' || to.path === '/register') {
    if (token) {
      next('/dashboard')
      return
    }
    next()
    return
  }
  
  // 其他页面需要 token
  if (!token) {
    next('/login')
    return
  }
  
  // 权限检查
  if (to.meta.roles && to.meta.roles.length > 0) {
    if (!to.meta.roles.includes(userStore.role)) {
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router