'use client'

import { useState } from 'react'
import { Search, Plus, Trash2, Users, AlertCircle, UserX } from 'lucide-react'
import { RoleDropdown } from './roledropdown'
import { ProjectRole } from '@/features/projects/schemas'
import { initials, MOCK_WORKSPACE_MEMBERS } from '@/features/projects/constants'

export type AddedMember = (typeof MOCK_WORKSPACE_MEMBERS)[number] & {
  role: Exclude<ProjectRole, 'OWNER'>
}

interface Step2MembersProps {
  members: AddedMember[]
  onAdd: (m: (typeof MOCK_WORKSPACE_MEMBERS)[number]) => void
  onRemove: (userId: string) => void
  onRoleChange: (userId: string, role: ProjectRole) => void
}

export function Step2Members({
  members,
  onAdd,
  onRemove,
  onRoleChange,
}: Step2MembersProps) {
  const [search, setSearch] = useState('')

  const addedIds = new Set(members.map(m => m.userId))
  const filtered = MOCK_WORKSPACE_MEMBERS.filter(
    m =>
      !addedIds.has(m.userId) &&
      (search === '' ||
        m.fullName.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      {/* Search */}
      <div className="flex flex-col gap-1.5">
        <label className="font-sans text-xs font-medium text-muted-foreground">
          Search workspace members
        </label>
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-4 top-1/2
            -translate-y-1/2 text-muted-foreground/60"
          />
          <input
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Name or email…"
            className="w-full rounded-xl border border-border bg-background
              pl-10 pr-4 py-3 font-sans text-sm text-foreground
              placeholder:text-muted-foreground/35 outline-none transition-all duration-150
              focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]"
          />
        </div>

        {/* Results dropdown */}
        {search && filtered.length > 0 && (
          <div
            className="overflow-hidden rounded-xl border border-border bg-card
            shadow-[0_8px_24px_oklch(0_0_0/0.4)]
            animate-in fade-in-0 slide-in-from-top-1 duration-150"
          >
            {filtered.slice(0, 5).map(m => (
              <button
                key={m.userId}
                type="button"
                onClick={() => {
                  onAdd(m)
                  setSearch('')
                }}
                className="group flex w-full items-center gap-3 px-4 py-2.5
                  transition-colors duration-100 hover:bg-accent"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-full font-sans text-xs font-semibold ${m.avatarColor}`}
                >
                  {initials(m.fullName)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-sans text-xs font-medium text-foreground truncate">
                    {m.fullName}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground truncate">
                    {m.email}
                  </p>
                </div>
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center
                  rounded-full bg-primary/10 text-primary
                  opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                >
                  <Plus size={11} />
                </div>
              </button>
            ))}
          </div>
        )}

        {search && filtered.length === 0 && (
          <div
            className="flex items-center gap-2.5 rounded-xl border border-destructive/20
            bg-destructive/5 px-4 py-3
            animate-in fade-in-0 slide-in-from-top-1 duration-150"
          >
            <UserX size={13} className="shrink-0 text-destructive/70" />
            <div className="min-w-0">
              <p className="font-sans text-xs font-medium text-destructive/80">
                No members found
              </p>
              <p className="font-sans text-[10px] text-muted-foreground truncate">
                No workspace member matches &quot;
                <span className="text-foreground">{search}</span>&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Added members list */}
      {members.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Added — {members.length}
            </span>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
              Role
            </span>
          </div>
          <div
            className="flex flex-col divide-y divide-border/60 bg-background"
            style={{ maxHeight: '180px', overflowY: 'auto' }}
          >
            {members.map(m => (
              <div
                key={m.userId}
                className="group flex items-center gap-3 px-4 py-2.5
                  transition-colors duration-100 hover:bg-accent/40"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-full font-sans text-xs font-semibold ${m.avatarColor}`}
                >
                  {initials(m.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-medium text-foreground truncate">
                    {m.fullName}
                  </p>
                  <p className="font-sans text-[10px] text-muted-foreground truncate">
                    {m.email}
                  </p>
                </div>
                <RoleDropdown value={m.role} onChange={r => onRoleChange(m.userId, r)} />
                <button
                  onClick={() => onRemove(m.userId)}
                  className="ml-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg
                    text-muted-foreground/30 opacity-0 group-hover:opacity-100
                    transition-all duration-150
                    hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center gap-2.5 rounded-xl
          border border-dashed border-border/60 bg-muted/10 py-8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50">
            <Users size={16} className="text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <p className="font-sans text-xs font-medium text-muted-foreground">
              No members added yet
            </p>
            <p className="font-sans text-[10px] text-muted-foreground/50 mt-0.5">
              Search above to invite workspace members
            </p>
          </div>
        </div>
      )}

      {/* Owner note */}
      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/20 px-4 py-3">
        <AlertCircle size={12} className="mt-0.5 shrink-0 text-muted-foreground/60" />
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          You&apos;re automatically set as{' '}
          <span className="font-semibold text-foreground">Owner</span>. Only existing
          workspace members can be added.
        </p>
      </div>
    </div>
  )
}
