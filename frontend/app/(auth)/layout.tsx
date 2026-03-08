'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthGuard } from '@/features/auth/hooks'
import { Spinner } from '@/components/ui/spinner'
import { useListUserWorkspaces } from '@/features/workspace/hooks'

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, initialized } = useAuthGuard()

  const { data: workspaces, isLoading: wsLoading } = useListUserWorkspaces()

  useEffect(() => {
    if (!initialized) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (user.is_new) {
      router.replace('/onboarding')
      return
    }

    if (!wsLoading && workspaces) {
      if (workspaces.length === 0) {
        router.replace('/onboarding/create-workspace')
      } else {
        router.replace(`/workspace/${workspaces[0].id}/dashboard`)
      }
    }
  }, [user, initialized, wsLoading, workspaces, router])

  if (!initialized || wsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return <>{children}</>
}
