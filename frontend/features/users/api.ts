import api from '@/lib/api'
import { User } from './types'

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get('/users/me', {})
  return data
}
