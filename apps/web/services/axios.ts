import axios from 'axios'
import Cookies from 'js-cookie'

import { Token } from '@/hooks/useAuthentication'

const enviromentDomain = process.env.NEXT_PUBLIC_API_URL
const baseURL = enviromentDomain ? enviromentDomain : 'http://localhost:8000'

function getAccessToken() {
  const tokenString = Cookies.get('token')
  if (tokenString) {
    const token = (JSON.parse(tokenString) as Token)?.access_token
    if (token) {
      return token
    }
  }
  return ''
}

function getRefreshToken() {
  const tokenString = Cookies.get('token')
  if (tokenString) {
    const token = (JSON.parse(tokenString) as Token)?.refresh_token
    if (token) {
      return token
    }
  }
  return ''
}

function setTokens(tokens: Token) {
  Cookies.set('token', JSON.stringify(tokens), { expires: 7 })
}

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (originalRequest.url.includes('/refresh/')) {
      Cookies.remove('token')
      window.location.href = '/'
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = getRefreshToken()
        const response = await api.post(`/refresh/`, {
          refresh: refreshToken,
        })

        const newTokens: Token = response.data
        setTokens(newTokens)

        api.defaults.headers.Authorization = `Bearer ${newTokens.access_token}`
        originalRequest.headers.Authorization = `Bearer ${newTokens.access_token}`

        return api(originalRequest)
      } catch (refreshError) {
        Cookies.remove('token')
        window.location.href = '/'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
