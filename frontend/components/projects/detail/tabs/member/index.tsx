'use client'

import { useState, useMemo } from 'react'
import { UserPlus, Shield, Users, User } from 'lucide-react'
import OwnerHeroCard from './ownerHeroCard'
import MemberRow from './memberRow'
import type { ProjectRole } from '@/features/projects/detail/types'
import type { MemberWithStats } from './memberTab.types'
import InviteMemberModal from '../../invitemembermodal'
import {
  useProjectMembers,
  useUpdateProjectMember,
  useRemoveProjectMember,
  useAddProjectMember,
} from '@/features/projects/detail/hooks'
import { useParams } from 'next/navigation'
import { useWorkspaceId } from '@/hooks/useworkspaceid'

export default function MembersTab() {
  const workspaceId = useWorkspaceId()
  const params = useParams()
  const projectId = Number(params.projectId)
  const [inviteOpen, setInviteOpen] = useState(false)

  const { data: membersData = [] } = useProjectMembers(projectId)
  const updateMemberMutation = useUpdateProjectMember(projectId)
  const removeMemberMutation = useRemoveProjectMember(projectId)
  const addMemberMutation = useAddProjectMember(projectId)

  const members: MemberWithStats[] = useMemo(
    () =>
      membersData.map(m => ({
        ...m,
        id: m.userId,
        taskTotal: 0,
        taskDone: 0,
      })),
    [membersData],
  )

  const owner = members.find(m => m.role === 'OWNER')
  const rest = members
    .filter(m => m.role !== 'OWNER')
    .sort((a, b) => {
      const order = { ADMIN: 0, MEMBER: 1, OWNER: 2 }
      return order[a.role] - order[b.role]
    })

  const adminCount = members.filter(m => m.role === 'ADMIN').length
  const memberCount = members.filter(m => m.role === 'MEMBER').length

  const handleChangeRole = async (userId: number, newRole: ProjectRole) => {
    await updateMemberMutation.mutateAsync({
      userId,
      role: newRole,
      status: null,
    })
  }

  const handleRemove = async (userId: number) => {
    await removeMemberMutation.mutateAsync(userId)
  }

  const handleInvite = async (userId: number, role?: string) => {
    await addMemberMutation.mutateAsync({ userId, role })
    setInviteOpen(false)
  }

  return (
    <>
      <div className="p-6 flex flex-col gap-5">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Members</h2>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">
              {members.length} people
              {adminCount > 0 && ` · ${adminCount} admin${adminCount > 1 ? 's' : ''}`}
              {memberCount > 0 && ` · ${memberCount} member${memberCount > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => setInviteOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 shrink-0
              text-xs font-semibold text-primary-foreground
              hover:bg-primary/90 transition-colors duration-100
              shadow-sm shadow-primary/20"
          >
            <UserPlus size={12} /> Invite Member
          </button>
        </div>

        {/* ── Stats strip ──────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Total',
              value: members.length,
              Icon: Users,
              color: 'text-primary',
              bg: 'bg-primary/5',
              border: 'border-primary/15',
            },
            {
              label: 'Admins',
              value: adminCount,
              Icon: Shield,
              color: 'text-blue-400',
              bg: 'bg-blue-400/5',
              border: 'border-blue-400/15',
            },
            {
              label: 'Members',
              value: memberCount,
              Icon: User,
              color: 'text-muted-foreground',
              bg: 'bg-muted/20',
              border: 'border-border/40',
            },
          ].map(s => (
            <div
              key={s.label}
              className={`flex items-center gap-3 rounded-2xl border ${s.border} ${s.bg} px-4 py-3.5`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center
                rounded-xl ${s.bg} border ${s.border}`}
              >
                <s.Icon size={14} className={s.color} />
              </div>
              <div>
                <p className={`text-xl font-bold tabular-nums leading-none ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground/50 mt-0.5 uppercase tracking-wider">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Owner hero card ───────────────────────────────── */}
        {owner && <OwnerHeroCard member={owner} />}

        {/* ── Admins & Members section ──────────────────────── */}
        {rest.length > 0 && (
          <div className="flex flex-col gap-0">
            {/* Section header */}
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                Admins & Members
              </span>
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-[10px] text-muted-foreground/35 tabular-nums">
                {rest.length}
              </span>
            </div>

            {/* Table header */}
            <div
              className="grid grid-cols-[36px_192px_96px_1fr_28px] gap-4 items-center
              px-4 py-2 mb-1"
            >
              {['', 'Name', 'Role', 'Workload', ''].map((h, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold text-muted-foreground/35
                    uppercase tracking-wider"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows container */}
            <div className="rounded-2xl border border-border/60 bg-card overflow-visible">
              {rest.map((member, i) => (
                <MemberRow
                  key={member.id}
                  member={member}
                  isFirst={i === 0}
                  isLast={i === rest.length - 1}
                  onChangeRole={handleChangeRole}
                  onRemove={() => handleRemove(member.userId)}
                  onViewTasks={id => console.log('View tasks', id)}
                  isLoading={
                    updateMemberMutation.isPending || removeMemberMutation.isPending
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Invite modal ──────────────────────────────────────── */}
      {inviteOpen && (
        <InviteMemberModal
          currentMembers={members.map(m => ({
            userId: m.userId,
            fullName: m.fullName,
            role: m.role,
            joinedAt: m.joinedAt,
            status: m.status,
          }))}
          onClose={() => setInviteOpen(false)}
          onInvite={(userId, role) => {
            handleInvite(userId, role)
          }}
          workspaceId={workspaceId}
        />
      )}
    </>
  )
}
