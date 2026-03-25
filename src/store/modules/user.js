import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    username: localStorage.getItem('username') || '',
    realName: localStorage.getItem('realName') || '',
    userId: localStorage.getItem('userId') || ''
  }),
  
  actions: {
    async login(loginForm) {
      const res = await login(loginForm)
      
      console.log('=== User Store 登录响应 ===')
      console.log('res:', res)
      console.log('res.data:', res.data)
      
      // ⭐ 检查响应数据结构
      if (res.data && res.data.data) {
        const userData = res.data.data
        
        this.token = userData.token
        this.role = userData.role
        this.username = userData.username
        this.realName = userData.realName
        this.userId = userData.userId || userData.id
        
        // ⭐ 保存到 localStorage
        localStorage.setItem('token', userData.token)
        localStorage.setItem('role', userData.role)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('realName', userData.realName)
        localStorage.setItem('userId', userData.userId || userData.id)
        
        console.log('=== 用户信息已存储 ===')
        console.log('token:', this.token)
        console.log('role:', this.role)
      } else {
        console.error('响应格式错误:', res)
        throw new Error('登录响应格式错误')
      }
      
      return res
    },
    
    async logout() {
      this.token = ''
      this.role = ''
      this.username = ''
      this.realName = ''
      this.userId = ''
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
      localStorage.removeItem('realName')
      localStorage.removeItem('userId')
    }
  }
})