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
  const { data: user, refetch, isLoading } = useCurrentUser()

  useEffect(() => {
    const initAuth = async () => {
      try {
        await api.post('/auth/refresh', {}, { withCredentials: true })
        await refetch()
      } catch (err) {
        console.error("Auth init failed", err)
      } finally {
        setInitialized(true)
      }
    }

    if (!initialized) {
      initAuth()
    }
  }, [initialized, refetch])

  return { user, initialized: initialized && !isLoading }
}
