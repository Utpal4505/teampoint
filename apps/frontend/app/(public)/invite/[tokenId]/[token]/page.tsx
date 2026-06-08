'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { useValidateInvite, useAcceptInvite } from '@/features/inviteMember/hooks'
import { useWorkspaceStore } from '@/store/workspace.store'
import { handleApiError } from '@/lib/handle-api-error'
import { toast } from 'sonner'
import api from '@/lib/api'

export default function InviteTokenPage({
  params,
}: {
  params: Promise<{ tokenId: string; token: string }>
}) {
  const { tokenId, token } = use(params)
  const router = useRouter()
  const setCurrentWorkspace = useWorkspaceStore(state => state.setCurrentWorkspace)

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)

  const {
    data: inviteData,
    isLoading: isValidating,
    error: validationError,
  } = useValidateInvite(tokenId, token)

  const acceptInviteMutation = useAcceptInvite()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.post('/auth/refresh', {}, { withCredentials: true })
        const res = await api.get('/users/me', { withCredentials: true })
        if (res.data?.data) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  const handleAccept = async () => {
    if (isAuthenticated) {
      setIsAccepting(true)
      try {
        const result = await acceptInviteMutation.mutateAsync({
          tokenId: Number(tokenId),
          token,
        })

        toast.success('Invite accepted! Redirecting to workspace...')
        setCurrentWorkspace(result.workspaceId)
        router.replace(`/workspace/${result.workspaceId}/projects`)
      } catch (error) {
        handleApiError(error)
        setIsAccepting(false)
      }
    } else {
      sessionStorage.setItem(
        'inviteToken',
        JSON.stringify({ tokenId, token }),
      )
      router.push('/login?redirect=/invite/continue')
    }
  }

  if (isValidating || isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <p className="text-sm text-muted-foreground animate-pulse">
            Validating your invite...
          </p>
        </div>
      </div>
    )
  }

  if (validationError) {
    const errorMessage =
      (validationError as any)?.response?.data?.message || 'This invite link is invalid or has expired.'

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
                Invite Not Valid
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo / Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
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
              className="text-primary"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>

          {/* Invite info */}
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              You&apos;re Invited!
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {inviteData?.invitedByName}
              </span>{' '}
              has invited you to join
            </p>
          </div>

          {/* Workspace name + role */}
          <div className="w-full rounded-xl border border-border bg-muted/50 p-4">
            <p className="text-lg font-semibold text-foreground">
              {inviteData?.workspaceName}
            </p>
            <div className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {inviteData?.role}
            </div>
          </div>

          {/* Email notice */}
          <p className="text-xs text-muted-foreground">
            This invite was sent to{' '}
            <span className="font-medium text-foreground">
              {inviteData?.email}
            </span>
          </p>

          {/* Expiry notice */}
          {inviteData?.expiresAt && (
            <p className="text-xs text-muted-foreground">
              ⏳ Expires{' '}
              {new Date(inviteData.expiresAt).toLocaleString()}
            </p>
          )}

          {/* Accept button */}
          <button
            onClick={handleAccept}
            disabled={isAccepting}
            className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAccepting ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Accepting...
              </span>
            ) : isAuthenticated ? (
              'Accept Invitation'
            ) : (
              'Sign in to Accept'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
