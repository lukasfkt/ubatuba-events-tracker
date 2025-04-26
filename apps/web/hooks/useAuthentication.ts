import Cookies from 'js-cookie'
import { create } from 'zustand'

import { handleErroMessage, showToast } from '@/lib/utils'
import { api } from '@/services/axios'
import type { Token } from '@/types'

interface useAuthenticationProps {
  login: (username: string, password: string) => Promise<boolean>
  registerUser: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthentication = create<useAuthenticationProps>(() => ({
  login: async (username: string, password: string) => {
    try {
      const { data } = await api.post('/login/', { username, password })
      showToast('User authenticated successfully', 'success')
      const tokens: Token = data
      Cookies.set('token', JSON.stringify(tokens), { expires: 7 })
      return true
    } catch (error) {
      handleErroMessage(error)
      return false
    }
  },

  registerUser: async (username: string, password: string) => {
    try {
      const { data } = await api.post('/register/', { username, password })
      showToast('User registered successfully', 'success')
      const tokens: Token = data
      Cookies.set('token', JSON.stringify(tokens), { expires: 7 })
      return true
    } catch (error) {
      handleErroMessage(error)
      return false
    }
  },

  logout: () => {
    try {
      api.defaults.headers.common.Authorization = undefined
      Cookies.remove('token')
      window.location.href = '/login'
    } catch {
      showToast('Falha ao deslogar', 'error')
    }
  },
}))
