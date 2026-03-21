import { useMutation } from '@tanstack/react-query'
import { logout } from './api'
import { useCurrentUser } from '../users/hooks'
import { useEffect, useRef, useState } from 'react'
import api from '@/lib/api'
import { useUserStore } from '@/store/user.store'

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  })
}

export const useAuthGuard = () => {
  const [initialized, setInitialized] = useState(false)
  const { data: user, refetch, isLoading } = useCurrentUser()
  const setUser = useUserStore(s => s.setUser)
  const setUserRef = useRef(setUser)

  useEffect(() => {
    const initAuth = async () => {
      try {
        await api.post('/auth/refresh', {}, { withCredentials: true })
        const { data } = await refetch()
        if (data) setUserRef.current(data)
      } catch (err) {
        console.error('Auth init failed', err)
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
