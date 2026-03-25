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
      const res = await login(loginForm)
      
      if (res.data && res.data.data) {
        const userData = res.data.data
        
        this.token = userData.token
        this.role = userData.role
        this.username = userData.username
        this.realName = userData.realName
        
        localStorage.setItem('token', userData.token)
        localStorage.setItem('role', userData.role)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('realName', userData.realName)
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