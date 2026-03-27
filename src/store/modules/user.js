import { defineStore } from 'pinia'
import { login as loginApi, getUserInfo } from '@/api/user'

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
      try {
        const res = await loginApi(loginForm)
        
        console.log('=== user.js login 响应 ===')
        console.log('res:', res)
        console.log('res.data:', res.data)
        console.log('res.data.data:', res.data?.data)
        
        // ⭐ 修复：后端返回 Result.success(data)，所以数据在 res.data.data
        if (res.code === 200 && res.data) {
          const userData = res.data
          
          this.token = userData.token || ''
          this.role = userData.role || ''
          this.username = userData.username || ''
          this.realName = userData.realName || ''
          this.userId = userData.userId || ''
          
          // ⭐ 存储到 localStorage
          localStorage.setItem('token', this.token)
          localStorage.setItem('role', this.role)
          localStorage.setItem('username', this.username)
          localStorage.setItem('realName', this.realName)
          localStorage.setItem('userId', this.userId)
          
          console.log('=== token 已存储 ===')
          console.log('localStorage token:', localStorage.getItem('token'))
          console.log('localStorage role:', localStorage.getItem('role'))
        }
        
        return res
      } catch (error) {
        console.error('=== login 失败 ===')
        console.error('error:', error)
        throw error
      }
    },
    
    async getUserInfo() {
      try {
        const res = await getUserInfo()
        if (res.data) {
          this.userId = res.data.id
          this.username = res.data.username
          this.role = res.data.role
          this.realName = res.data.realName
        }
        return res
      } catch (error) {
        throw error
      }
    },
    
    logout() {
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