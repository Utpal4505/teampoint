import { useMutation } from '@tanstack/react-query'
import { logout } from './api'
import { useCurrentUser } from '../users/hooks'
import { useEffect, useState } from 'react'
import api from '@/lib/api'

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  })
}

export const useAuthGuard = () => {
  const [initialized, setInitialized] = useState(false)
  const { data: user, refetch } = useCurrentUser()

  useEffect(() => {
    const initAuth = async () => {
      try {
        await api.post('/auth/refresh', {}, { withCredentials: true })

        await refetch()
      } catch {
        window.location.href = '/login'
      } finally {
        setInitialized(true)
      }
    }

    initAuth()
  }, [refetch])

  return { user, initialized }
}
