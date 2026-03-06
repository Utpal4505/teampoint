import api from '@/lib/api'
import { User } from './types'
import { AxiosRequestConfig } from 'axios'

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  authFlag?: boolean
}

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/users/me', {
    authFlag: true,
  } as CustomAxiosRequestConfig)
  return data
}
