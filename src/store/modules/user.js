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
      console.log('登录表单:', loginForm)
      
      const res = await login(loginForm)
      
      console.log('=== 登录响应 ===')
      console.log('res:', res)
      console.log('res.code:', res.code)
      console.log('res.data:', res.data)
      console.log('res.data.data:', res.data?.data)
      
      if (res.code === 200 && res.data && res.data.data) {
        const userData = res.data.data
        
        console.log('=== 用户数据 ===')
        console.log('token:', userData.token)
        console.log('role:', userData.role)
        console.log('username:', userData.username)
        console.log('realName:', userData.realName)
        
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
        console.log('role:', localStorage.getItem('role'))
      } else {
        console.error('=== 登录响应格式错误 ===')
        console.error('res:', res)
        throw new Error(res.message || '登录失败')
      }
      
      console.log('=== User Store Login 完成 ===')
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