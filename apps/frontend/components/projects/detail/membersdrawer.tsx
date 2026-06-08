'use client'

import { useCurrentUser } from '@/features/users/hooks'
import {
  useAddProjectMember,
  useUpdateProjectMember,
  useRemoveProjectMember,
  useProjectMembers,
} from '@/features/projects/detail/hooks'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Crown, MoreVertical, Shield, User, UserPlus, X } from 'lucide-react'
import { ProjectMember, ProjectRole } from '@/features/projects/detail/types'
import { useState } from 'react'
import { getInitials } from '@/lib/utils'
import InviteMemberModal from './invitemembermodal'
import Image from 'next/image'

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
  workspaceId: number
  projectId: number
}

export default function MembersDrawer({
  open,
  onClose,
  members: membersProp,
  workspaceId,
  projectId,
}: MembersDrawerProps) {
  const [inviteOpen, setInviteOpen] = useState(false)
  const { data: currentUser } = useCurrentUser()

  const addMember = useAddProjectMember(projectId)
  const { data: membersData } = useProjectMembers(projectId)

  const members: ProjectMember[] = membersData
    ? membersData.map(m => ({
        userId: m.userId,
        user: {
          id: m.userId,
          fullName: m.fullName,
          avatarUrl: m.avatarUrl ?? null,
          email: m.email ?? '',
        },
        role: m.role,
        joinedAt: m.joinedAt,
        status: m.status,
        projectId: m.projectId,
      }))
    : membersProp

  const updateMember = useUpdateProjectMember(projectId)
  const removeMember = useRemoveProjectMember(projectId)

  const currentUserInProject = members.find(m => m.user.id === currentUser?.id)
  const canManage =
    currentUserInProject?.role === 'OWNER' || currentUserInProject?.role === 'ADMIN'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300
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
              text-muted-foreground transition-colors duration-100
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
            const isMe = m.user.id === currentUser?.id
            const canEditThisMember = canManage && !isMe && m.role !== 'OWNER'

            return (
              <div
                key={m.user.id}
                className="flex items-center gap-3 px-5 py-2.5
                  transition-colors duration-100 hover:bg-accent/30 group"
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
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-medium text-foreground truncate">
                      {m.user.fullName}
                    </p>
                    {isMe && (
                      <span className="text-[9px] bg-primary/10 text-primary px-1 rounded uppercase font-bold">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Joined{' '}
                    {new Date(m.joinedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`flex items-center gap-1 text-[10px] font-semibold ${role.color}`}
                  >
                    <RoleIcon size={11} />
                    {role.label}
                  </span>

                  {canEditThisMember && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical size={12} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        {m.role === 'MEMBER' && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateMember.mutate({ userId: m.user.id, role: 'ADMIN' })
                            }
                          >
                            <Shield size={12} className="mr-2 text-blue-400" />
                            Make Admin
                          </DropdownMenuItem>
                        )}
                        {m.role === 'ADMIN' && (
                          <DropdownMenuItem
                            onClick={() =>
                              updateMember.mutate({ userId: m.user.id, role: 'MEMBER' })
                            }
                          >
                            <User size={12} className="mr-2 text-muted-foreground" />
                            Make Member
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => removeMember.mutate(m.user.id)}
                        >
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer — Invite */}
        <div className="border-t border-border px-5 py-4 shrink-0">
          <button
            onClick={() => setInviteOpen(true)}
            disabled={!canManage}
            className="flex w-full items-center justify-center gap-2 rounded-xl
              bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground
              shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)] transition-all duration-150
              hover:opacity-90 hover:-translate-y-px active:translate-y-0
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <UserPlus size={14} /> Invite Member
          </button>
        </div>
      </div>

      {/* Invite modal — renders above drawer */}
      {inviteOpen && (
        <InviteMemberModal
          workspaceId={workspaceId}
          currentMembers={members.map(m => ({
            userId: m.user.id,
            fullName: m.user.fullName,
            role: m.role,
            joinedAt: new Date(m.joinedAt).toISOString(),
            status: 'ACTIVE',
          }))}
          onClose={() => setInviteOpen(false)}
          onInvite={(id, role) => {
            addMember.mutate({ userId: id, role })
          }}
        />
      )}
    </>
  )
}
