'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

import { useWorkspaceStore } from '@/store/workspace.store'
import { useCurrentUser } from '@/features/users/hooks'
import { useListUserWorkspaces } from '@/features/workspace/hooks'

export default function AuthCallbackPage() {
  const router = useRouter()

  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: workspaces, isLoading: workspaceLoading } = useListUserWorkspaces()

  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace)

  useEffect(() => {
    if (userLoading || workspaceLoading) return

    if (!user) {
      router.replace('/login')
      return
    }

    const savedInvite = sessionStorage.getItem('inviteToken')
    if (savedInvite) {
      router.replace('/invite/continue')
      return
    }

    if (user.is_new) {
      router.replace('/onboarding/step-1')
      return
    }

    if (!workspaces || workspaces.length === 0) {
      router.replace('/onboarding/create-workspace')
      return
    }

    const firstWorkspace = workspaces[0]

    setCurrentWorkspace(firstWorkspace.id)

    router.replace(`/workspace/${firstWorkspace.id}/projects`)
  }, [user, workspaces, userLoading, workspaceLoading, router, setCurrentWorkspace])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  )
}
