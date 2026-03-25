import { defineStore } from 'pinia'
import { login } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    username: localStorage.getItem('username') || '',
    realName: localStorage.getItem('realName') || ''
  }),
  
  actions: {
    async login(loginForm) {
      console.log('=== User Store Login 开始 ===')
      
      const res = await login(loginForm)
      
      console.log('=== 登录响应 ===')
      console.log('res.code:', res.code)
      console.log('res.data:', res.data)
      
      // ⭐ 修复：直接使用 res.data，不是 res.data.data
      if (res.code === 200 && res.data) {
        const userData = res.data  // ⭐ 修改这里
        
        console.log('=== 用户数据 ===')
        console.log('token:', userData.token)
        console.log('role:', userData.role)
        
        this.token = userData.token
        this.role = userData.role
        this.username = userData.username
        this.realName = userData.realName
        
        localStorage.setItem('token', userData.token)
        localStorage.setItem('role', userData.role)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('realName', userData.realName)
        
        console.log('=== localStorage 已设置 ===')
        console.log('token:', localStorage.getItem('token'))
      } else {
        console.error('=== 登录失败 ===')
        throw new Error(res.message || '登录失败')
      }
      
      return res
    },
    
    logout() {
      this.token = ''
      this.role = ''
      this.username = ''
      this.realName = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
      localStorage.removeItem('realName')
    }
  }
})