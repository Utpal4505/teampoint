'use client'

import { useState } from 'react'
import { X, UserPlus, CheckCircle2, ChevronDown, Mail } from 'lucide-react'
import { useSendWorkspaceInvite } from '@/features/workspace/hooks'
import { toast } from 'sonner'

interface InviteMemberModalProps {
  open: boolean
  onClose: () => void
  workspaceId: number
}

type InviteRole = 'ADMIN' | 'MEMBER'

const ROLES: {
  value: InviteRole
  label: string
  desc: string
  color: string
  bg: string
}[] = [
  {
    value: 'MEMBER',
    label: 'Member',
    desc: 'Can view and work on tasks',
    color: 'text-muted-foreground',
    bg: 'bg-muted/40',
  },
  {
    value: 'ADMIN',
    label: 'Admin',
    desc: 'Can manage members and settings',
    color: 'text-amber-500',
    bg: 'bg-amber-400/15',
  },
]

function RoleDropdown({
  value,
  onChange,
}: {
  value: InviteRole
  onChange: (r: InviteRole) => void
}) {
  const [open, setOpen] = useState(false)
  const current = ROLES.find(r => r.value === value)!

  return (
    <div className="relative">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation()
          setOpen(v => !v)
        }}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold
          border transition-colors duration-100 ${current.bg}
          ${value === 'ADMIN' ? 'border-amber-400/30 text-amber-500' : 'border-border/50 text-muted-foreground'}`}
      >
        {current.label}
        <ChevronDown
          size={10}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div
            className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-border
              bg-background shadow-xl shadow-black/15 py-1.5 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {ROLES.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => {
                  onChange(r.value)
                  setOpen(false)
                }}
                className="flex items-start gap-3 w-full px-3.5 py-2.5
                  hover:bg-accent transition-colors duration-100 text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${r.color}`}>{r.label}</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-0.5">{r.desc}</p>
                </div>
                {r.value === value && (
                  <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function InviteMemberModal({
  open,
  onClose,
  workspaceId,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<InviteRole>('MEMBER')

  const { mutate: sendInvite, isPending } = useSendWorkspaceInvite()

  if (!open) return null

  const handleInvite = () => {
    if (!email) {
      toast.error('Please enter an email address')
      return
    }

    sendInvite(
      { workspaceId, email, role },
      {
        onSuccess: () => {
          toast.success(`Invitation sent to ${email}`)
          setEmail('')
          setRole('MEMBER')
          onClose()
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || 'Failed to send invitation')
        },
      }
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-[101] -translate-x-1/2 -translate-y-1/2
        w-full max-w-[420px] rounded-2xl border border-border bg-background
        shadow-2xl shadow-black/25 flex flex-col"
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0 bg-muted/10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl
              bg-primary/10 border border-primary/20"
            >
              <UserPlus size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-foreground">Invite to Workspace</h2>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Send an email invitation to collaborate
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────── */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground/80 pl-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="w-full rounded-xl border border-border/60 bg-muted/20
                  pl-9 pr-4 py-2.5 text-[13px] text-foreground
                  placeholder:text-muted-foreground/40 outline-none
                  focus:border-primary/40 focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all duration-200"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInvite()
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/10">
            <div>
              <p className="text-[13px] font-semibold text-foreground/90">Workspace Role</p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">Choose their permission level</p>
            </div>
            <RoleDropdown value={role} onChange={setRole} />
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div
          className="flex items-center justify-end gap-2.5 px-5 py-4
          border-t border-border/60 bg-muted/10 shrink-0 rounded-b-2xl"
        >
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-[13px] font-medium text-muted-foreground hover:bg-black/5 hover:text-foreground transition-colors duration-150"
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            disabled={!email || isPending}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2
              text-[13px] font-semibold text-primary-foreground shadow-md shadow-primary/20
              hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200
              disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>Sending...</>
            ) : (
              <>
                <UserPlus size={14} />
                Send Invite
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
