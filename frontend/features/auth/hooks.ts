import { useMutation } from '@tanstack/react-query'
import { logout } from './api'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '../users/hooks'
import { useEffect } from 'react'

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  })
}

export const useAuthGuard = () => {
  const { data: user, isLoading, error } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (error) {
      router.replace('/login')
      return
    }

    if (user?.is_new) {
      router.replace('/onboarding')
    }
  }, [user, isLoading, error, router])

  return { user, isLoading }
}
