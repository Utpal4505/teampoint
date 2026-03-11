'use client'

import Image from 'next/image'
import { X, UserPlus, Crown, Shield, User } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { ProjectMember, ProjectRole } from '@/features/projects/detail/types'

const ROLE_CONFIG: Record<
  ProjectRole,
  { label: string; Icon: React.ElementType; color: string }
> = {
  OWNER: { label: 'Owner', Icon: Crown, color: 'text-amber-400' },
  ADMIN: { label: 'Admin', Icon: Shield, color: 'text-blue-400' },
  MEMBER: { label: 'Member', Icon: User, color: 'text-muted-foreground' },
}

interface MembersDrawerProps {
  open: boolean
  onClose: () => void
  members: ProjectMember[]
}

export default function MembersDrawer({ open, onClose, members }: MembersDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-300
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        style={{ background: 'oklch(0 0 0 / 0.5)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[320px] flex-col
          border-l border-border bg-card
          shadow-[-32px_0_80px_oklch(0_0_0/0.5)]
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Top accent */}
        <div
          className="h-[2px] w-full shrink-0"
          style={{
            background:
              'linear-gradient(90deg,transparent,oklch(0.6 0.16 262/0.9) 50%,transparent)',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 shrink-0">
          <div>
            <h2 className="font-display text-sm font-bold text-foreground">Members</h2>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {members.length} member{members.length !== 1 ? 's' : ''} in this project
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground transition-all duration-150
              hover:bg-destructive/10 hover:text-destructive"
          >
            <X size={14} />
          </button>
        </div>

        <div className="h-px bg-border/60 mx-5 shrink-0" />

        {/* Members list */}
        <div className="flex-1 overflow-y-auto py-3">
          {members.map(m => {
            const role = ROLE_CONFIG[m.role as ProjectRole] ?? ROLE_CONFIG.MEMBER
            const RoleIcon = role.Icon
            return (
              <div
                key={m.user.id}
                className="flex items-center gap-3 px-5 py-2.5
                  transition-colors hover:bg-accent/30"
              >
                {m.user.avatarUrl ? (
                  <Image
                    src={m.user.avatarUrl}
                    alt={m.user.fullName}
                    width={34}
                    height={34}
                    className="rounded-full ring-1 ring-border/50 shrink-0 object-cover"
                  />
                ) : (
                  <div
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center
                    rounded-full bg-primary/20 text-[11px] font-bold text-primary"
                  >
                    {getInitials(m.user.fullName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {m.user.fullName}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Joined{' '}
                    {new Date(m.joinedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold ${role.color}`}
                >
                  <RoleIcon size={11} />
                  {role.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer — Invite */}
        <div className="border-t border-border px-5 py-4 shrink-0">
          <button
            className="flex w-full items-center justify-center gap-2 rounded-xl
              bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground
              shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)] transition-all
              hover:opacity-90 hover:-translate-y-px active:translate-y-0"
          >
            <UserPlus size={14} /> Invite Member
          </button>
        </div>
      </div>
    </>
  )
}
