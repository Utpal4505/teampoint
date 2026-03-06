'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthGuard } from '@/features/auth/hooks'
import { Spinner } from '@/components/ui/spinner'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter()
  const { user, initialized } = useAuthGuard()

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  if (user.is_new) {
    router.replace('/onboarding')
    return null
  }

  return <>{children}</>
}
