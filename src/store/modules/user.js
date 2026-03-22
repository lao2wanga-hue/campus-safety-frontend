import { defineStore } from 'pinia'
import { login, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userId: null,
    username: '',
    role: '',
    realName: ''
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.role === 'ADMIN',
    isReporter: (state) => state.role === 'REPORTER',
    isRectifier: (state) => state.role === 'RECTIFIER'
  },

  actions: {
    async login(loginForm) {
      try {
        const res = await login(loginForm)
        const { token, userId, username, role, realName } = res.data
        this.token = token
        this.userId = userId
        this.username = username
        this.role = role
        this.realName = realName
        setToken(token)
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },

    async getInfo() {
      try {
        const res = await getUserInfo()
        const { id, username, role, realName } = res.data
        this.userId = id
        this.username = username
        this.role = role
        this.realName = realName
        return res
      } catch (error) {
        return Promise.reject(error)
      }
    },

    logout() {
      this.token = null
      this.userId = null
      this.username = ''
      this.role = ''
      this.realName = ''
      removeToken()
    }
  }
})