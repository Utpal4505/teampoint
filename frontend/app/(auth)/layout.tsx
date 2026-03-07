'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthGuard } from '@/features/auth/hooks'
import { Spinner } from '@/components/ui/spinner'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, initialized } = useAuthGuard()

  useEffect(() => {
    if (initialized) {
      if (!user) {
        router.replace('/login')
      } else if (user.is_new) {
        router.replace('/onboarding')
      }
    }
  }, [user, initialized, router])

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user || user.is_new) {
    return null
  }

  return <>{children}</>
}
