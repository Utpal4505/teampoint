'use client'

import { useState } from 'react'
import { Loader2, Mail, Users, ArrowRight } from 'lucide-react'
import { ModalHeader } from './modalheader'
import { InviteInput } from './inviteinput'
import { InviteList } from './invitelist'
import {
  inviteMemberSchema,
  type WorkspaceRole,
  type InviteEntry,
  type InviteMembersPayload,
} from '@/features/inviteMember/schemas'

export type { InviteMembersPayload }

// Same gradient logic as CreateWorkspaceModal — keeps avatar consistent
function getAvatarGradient(name: string) {
  const gradients = [
    'from-[oklch(0.55_0.18_262)] to-[oklch(0.45_0.2_280)]',
    'from-[oklch(0.52_0.16_145)] to-[oklch(0.45_0.18_160)]',
    'from-[oklch(0.62_0.18_25)]  to-[oklch(0.52_0.2_340)]',
    'from-[oklch(0.58_0.16_55)]  to-[oklch(0.5_0.18_35)]',
    'from-[oklch(0.55_0.14_300)] to-[oklch(0.48_0.16_280)]',
  ]
  const i = name.charCodeAt(0) % gradients.length
  return gradients[i] || gradients[0]
}

interface Props {
  open: boolean
  onClose: () => void
  workspaceName: string
  onSubmit?: (payload: InviteMembersPayload) => Promise<void>
  onSkip?: () => void
}

export function InviteMembersModal({
  open,
  onClose,
  workspaceName,
  onSubmit,
  onSkip,
}: Props) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<WorkspaceRole>('MEMBER')
  const [invites, setInvites] = useState<InviteEntry[]>([])
  const [emailError, setEmailError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const initials = workspaceName.trim().slice(0, 2).toUpperCase() || 'WS'
  const gradient = getAvatarGradient(workspaceName || 'W')

  // ── Invite management ────────────────────────────────────
  function addInvite() {
    const result = inviteMemberSchema.safeParse({ email, role })
    if (!result.success) {
      setEmailError(result.error.flatten().fieldErrors.email?.[0])
      return
    }
    if (invites.find(i => i.email === email.trim().toLowerCase())) {
      setEmailError('Already added')
      return
    }
    setInvites(p => [
      ...p,
      { id: Date.now().toString(), email: email.trim().toLowerCase(), role },
    ])
    setEmail('')
    setEmailError(undefined)
  }

  function removeInvite(id: string) {
    setInvites(p => p.filter(i => i.id !== id))
  }

  function updateRole(id: string, newRole: WorkspaceRole) {
    setInvites(p => p.map(i => (i.id === id ? { ...i, role: newRole } : i)))
  }

  // ── Actions ──────────────────────────────────────────────
  function reset() {
    setEmail('')
    setRole('MEMBER')
    setInvites([])
    setEmailError(undefined)
    setLoading(false)
  }

  function handleSkip() {
    reset()
    onSkip?.()
    onClose()
  }

  async function handleSubmit() {
    let final = [...invites]
    // Auto-include typed but un-added email
    if (email.trim()) {
      const r = inviteMemberSchema.safeParse({ email, role })
      if (r.success)
        final = [
          ...final,
          { id: Date.now().toString(), email: email.trim().toLowerCase(), role },
        ]
    }
    if (final.length === 0) {
      handleSkip()
      return
    }

    if (onSubmit) {
      setLoading(true)
      await onSubmit({ invites: final })
      setLoading(false)
    }
    reset()
    onClose()
  }

  // Dynamic CTA
  function ctaContent() {
    if (loading)
      return (
        <>
          <Loader2 size={14} className="animate-spin" /> Sending…
        </>
      )
    const count = invites.length + (email.trim() ? 1 : 0)
    if (count > 0)
      return (
        <>
          <Mail size={14} /> Send {count} Invite{count !== 1 ? 's' : ''}
        </>
      )
    return (
      <>
        Go to Dashboard <ArrowRight size={14} />
      </>
    )
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.75)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) handleSkip()
      }}
    >
      <div
        className="relative w-full max-w-[480px] rounded-2xl border border-border bg-card
        shadow-[0_32px_80px_oklch(0_0_0/0.6)]
        animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Shimmer */}
        <div className="overflow-hidden rounded-t-2xl">
          <div
            className="h-[2px] w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 5%, oklch(0.6 0.16 262 / 0.8) 50%, transparent 95%)',
            }}
          />
        </div>

        <ModalHeader
          workspaceName={workspaceName}
          initials={initials}
          gradient={gradient}
          onClose={handleSkip}
        />

        <div className="h-px mx-6 bg-border" />

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 py-6">
          {/* Section label */}
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
              <Users size={12} className="text-primary" />
            </div>
            <p className="font-sans text-sm font-semibold text-foreground">
              Invite your team
            </p>
            <span
              className="rounded-md bg-muted px-[6px] py-[2px] font-sans text-[10px]
              text-muted-foreground/50"
            >
              optional
            </span>
          </div>

          <InviteInput
            email={email}
            role={role}
            error={emailError}
            onEmailChange={v => {
              setEmail(v)
              if (emailError) setEmailError(undefined)
            }}
            onRoleChange={setRole}
            onAdd={addInvite}
          />

          <InviteList
            invites={invites}
            workspaceName={workspaceName}
            onRemove={removeInvite}
            onRoleChange={updateRole}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-border px-6 py-4">
          <button
            onClick={handleSkip}
            className="rounded-xl border border-border bg-background px-5 py-2.5
              font-sans text-sm font-medium text-muted-foreground
              transition-all duration-150 hover:bg-accent hover:text-foreground
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl
              bg-primary px-5 py-2.5 font-sans text-sm font-bold text-primary-foreground
              shadow-[0_2px_16px_oklch(0.6_0.16_262/0.35)] transition-all duration-200
              hover:-translate-y-px hover:shadow-[0_6px_24px_oklch(0.6_0.16_262/0.5)]
              active:translate-y-0 active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {ctaContent()}
          </button>
        </div>
      </div>
    </div>
  )
}
