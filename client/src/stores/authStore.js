import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    username: '',
    email: ''
  }),
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)

      const decodedToken = jwtDecode(token)
      this.username = decodedToken.username
      this.email = decodedToken.email
    },
    clearToken() {
      this.token = null
      this.username = ''
      this.email = ''
      localStorage.removeItem('token')
    },
    updateUser(user) {
      this.username = user.username
    }
  }
})
