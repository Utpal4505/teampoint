'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useAcceptInvite } from '@/features/inviteMember/hooks'
import { useWorkspaceStore } from '@/store/workspace.store'
import { handleApiError } from '@/lib/handle-api-error'
import { toast } from 'sonner'

export default function InviteContinuePage() {
  const router = useRouter()
  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace)
  const acceptInviteMutation = useAcceptInvite()
  const [status, setStatus] = useState<'accepting' | 'error' | 'no-token'>('accepting')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const acceptSavedInvite = async () => {
      const saved = sessionStorage.getItem('inviteToken')

      if (!saved) {
        setStatus('no-token')
        return
      }

      try {
        const { tokenId, token } = JSON.parse(saved)

        if (!tokenId || !token) {
          setStatus('no-token')
          return
        }

        const result = await acceptInviteMutation.mutateAsync({
          tokenId: Number(tokenId),
          token,
        })
        sessionStorage.removeItem('inviteToken')

        toast.success('Welcome to the workspace!')
        setCurrentWorkspace(result.workspaceId)
        router.replace(`/workspace/${result.workspaceId}/projects`)
      } catch (error) {
        sessionStorage.removeItem('inviteToken')
        const errMsg =
          (error as any)?.response?.data?.message || 'Failed to accept the invite.'
        setErrorMessage(errMsg)
        setStatus('error')
        handleApiError(error)
      }
    }

    acceptSavedInvite()
  }, [])

  if (status === 'no-token') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                No Invite Found
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                It looks like there&apos;s no pending invite to accept.
                The invite may have already been processed.
              </p>
            </div>
            <button
              onClick={() => router.push('/auth-callback')}
              className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-destructive"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Failed to Accept Invite
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => router.push('/auth-callback')}
              className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-sm text-muted-foreground animate-pulse">
          Accepting your invite...
        </p>
      </div>
    </div>
  )
}
