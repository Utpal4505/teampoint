'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { X, UserPlus, Search, CheckCircle2, ChevronDown } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { ProjectMember } from '@/features/projects/detail/types'

// ── Fake workspace members — swap with useWorkspaceMembers() later ──
const FAKE_WORKSPACE_MEMBERS = [
  { id: 1, fullName: 'Utpal Kumar', avatarUrl: null, email: 'utpal@teampoint.app' },
  { id: 2, fullName: 'Rahul Sharma', avatarUrl: null, email: 'rahul@teampoint.app' },
  { id: 3, fullName: 'Aman Verma', avatarUrl: null, email: 'aman@teampoint.app' },
  { id: 4, fullName: 'Neha Singh', avatarUrl: null, email: 'neha@teampoint.app' },
  { id: 5, fullName: 'Dev Patel', avatarUrl: null, email: 'dev@teampoint.app' },
  { id: 6, fullName: 'Priya Gupta', avatarUrl: null, email: 'priya@teampoint.app' },
  { id: 7, fullName: 'Arjun Mehta', avatarUrl: null, email: 'arjun@teampoint.app' },
  { id: 8, fullName: 'Sneha Joshi', avatarUrl: null, email: 'sneha@teampoint.app' },
]

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

interface InviteMemberModalProps {
  currentMembers: ProjectMember[]
  onClose: () => void
  onInvite?: (userId: number, role: InviteRole) => void
}

// ── Small inline role dropdown ────────────────────────────────
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
        <div
          className="absolute right-0 top-full mt-1 z-50 w-52 rounded-xl border border-border
            bg-background shadow-xl shadow-black/15 py-1.5 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {ROLES.map(r => (
            <button
              key={r.value}
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
      )}
    </div>
  )
}

export default function InviteMemberModal({
  currentMembers,
  onClose,
  onInvite,
}: InviteMemberModalProps) {
  const [search, setSearch] = useState('')
  // selected: userId → role
  const [selected, setSelected] = useState<Record<number, InviteRole>>({})

  const currentIds = useMemo(
    () => new Set(currentMembers.map(m => m.user.id)),
    [currentMembers],
  )

  const filtered = FAKE_WORKSPACE_MEMBERS.filter(
    u =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  )

  function toggleSelect(userId: number) {
    setSelected(prev => {
      if (prev[userId] !== undefined) {
        const next = { ...prev }
        delete next[userId]
        return next
      }
      return { ...prev, [userId]: 'MEMBER' }
    })
  }

  function setRole(userId: number, role: InviteRole) {
    setSelected(prev => ({ ...prev, [userId]: role }))
  }

  const selectedCount = Object.keys(selected).length

  function handleConfirm() {
    Object.entries(selected).forEach(([userId, role]) => {
      onInvite?.(Number(userId), role)
    })
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2
        w-full max-w-[480px] rounded-2xl border border-border bg-background
        shadow-2xl shadow-black/25 flex flex-col overflow-hidden"
        style={{ maxHeight: '85vh' }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl
              bg-primary/10 border border-primary/20"
            >
              <UserPlus size={14} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Invite Members</h2>
              <p className="text-[11px] text-muted-foreground/50 mt-0.5">
                Add workspace members to this project
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Search ─────────────────────────────────────────── */}
        <div className="px-5 pt-4 pb-3 shrink-0">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              autoFocus
              className="w-full rounded-xl border border-border/60 bg-muted/20
                pl-8 pr-3 py-2.5 text-sm text-foreground
                placeholder:text-muted-foreground/35 outline-none
                focus:border-primary/40 focus:bg-background transition-colors duration-100"
            />
          </div>
        </div>

        {/* ── Selected chips ──────────────────────────────────── */}
        {selectedCount > 0 && (
          <div className="px-5 pb-3 flex items-center gap-2 flex-wrap shrink-0">
            {Object.entries(selected).map(([userId, role]) => {
              const user = FAKE_WORKSPACE_MEMBERS.find(u => u.id === Number(userId))
              if (!user) return null
              const roleMeta = ROLES.find(r => r.value === role)!
              return (
                <span
                  key={userId}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/25
                    bg-primary/8 pl-2 pr-1 py-1 text-[11px] font-medium text-primary"
                >
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded-full
                    bg-primary/20 text-[8px] font-bold"
                  >
                    {getInitials(user.fullName)}
                  </span>
                  {user.fullName.split(' ')[0]}
                  <span className={`text-[9px] font-bold ${roleMeta.color} opacity-70`}>
                    · {role}
                  </span>
                  <button
                    onClick={() => toggleSelect(user.id)}
                    className="flex h-4 w-4 items-center justify-center rounded-full
                      text-primary/50 hover:bg-primary/20 hover:text-primary transition-colors"
                  >
                    <X size={9} />
                  </button>
                </span>
              )
            })}
          </div>
        )}

        {/* ── Member list ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground/40">No members found</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filtered.map(user => {
                const isAlreadyIn = currentIds.has(user.id)
                const isSelected = selected[user.id] !== undefined
                const role = selected[user.id] ?? 'MEMBER'

                return (
                  <div
                    key={user.id}
                    onClick={() => !isAlreadyIn && toggleSelect(user.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5
                      transition-colors duration-100
                      ${
                        isAlreadyIn
                          ? 'opacity-40 cursor-not-allowed'
                          : isSelected
                            ? 'bg-primary/8 cursor-pointer'
                            : 'hover:bg-accent/60 cursor-pointer'
                      }`}
                  >
                    {/* Selection indicator */}
                    <div
                      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center
                      rounded-full border transition-colors duration-100
                      ${
                        isSelected
                          ? 'bg-primary border-primary'
                          : 'border-border/60 bg-transparent'
                      }`}
                      style={{ height: 18, width: 18 }}
                    >
                      {isSelected && (
                        <CheckCircle2 size={12} className="text-primary-foreground" />
                      )}
                    </div>

                    {/* Avatar */}
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt={user.fullName}
                        width={34}
                        height={34}
                        className="rounded-full object-cover shrink-0 ring-1 ring-border/40"
                      />
                    ) : (
                      <div
                        className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center
                        rounded-full text-[12px] font-bold ring-1 ring-border/40
                        ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted/60 text-muted-foreground'}`}
                      >
                        {getInitials(user.fullName)}
                      </div>
                    )}

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[13px] font-semibold leading-tight truncate
                        ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}
                      >
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-muted-foreground/45 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>

                    {/* Already in / role picker */}
                    {isAlreadyIn ? (
                      <span
                        className="text-[10px] font-semibold text-muted-foreground/50
                        bg-muted/40 px-2 py-0.5 rounded-full shrink-0"
                      >
                        Already in project
                      </span>
                    ) : isSelected ? (
                      <RoleDropdown value={role} onChange={r => setRole(user.id, r)} />
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between gap-3 px-5 py-4
          border-t border-border/60 bg-muted/10 shrink-0"
        >
          <p className="text-[11px] text-muted-foreground/50">
            {selectedCount === 0
              ? 'Select members to invite'
              : `${selectedCount} member${selectedCount !== 1 ? 's' : ''} selected`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-border/60 bg-background px-4 py-2
                text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground
                transition-colors duration-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2
                text-xs font-semibold text-primary-foreground
                hover:bg-primary/90 transition-colors duration-100
                disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <UserPlus size={12} />
              Invite {selectedCount > 0 ? `(${selectedCount})` : ''}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
