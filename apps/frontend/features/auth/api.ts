import api from '@/lib/api'

console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)

export const loginWithGoogle = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
}

export const loginWithGithub = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`
}

export const logout = () => {
  return api.post('/users/logout')
}

export const refreshToken = () => {
  return api.post('/auth/refresh')
}
