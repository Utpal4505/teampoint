import axios, { AxiosRequestConfig } from 'axios'

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  authFlag?: boolean
  _retry?: boolean
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

let refreshPromise: Promise<unknown> | null = null

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    const isAuthRoute =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh')

    if (isAuthRoute) return Promise.reject(error)
    if (!originalRequest.authFlag) return Promise.reject(error)

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          )
        }

        await refreshPromise
        refreshPromise = null

        return api(originalRequest)
      } catch (err) {
        refreshPromise = null
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  },
)

export default api
