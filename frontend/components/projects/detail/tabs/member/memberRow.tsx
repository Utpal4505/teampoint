'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import {
  Shield,
  User,
  MoreHorizontal,
  ChevronRight,
  CheckCircle2,
  LayoutGrid,
  UserMinus,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { MemberWithStats } from './memberTab.types'

function workloadColor(pct: number) {
  if (pct >= 80) return { bar: '#34d399', text: 'text-emerald-400' }
  if (pct >= 40) return { bar: '#fbbf24', text: 'text-amber-400' }
  return { bar: '#818cf8', text: 'text-indigo-400' }
}

function useOutsideClick(ref: React.RefObject<HTMLElement>, cb: () => void) {
  useEffect(() => {
    function h(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb()
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [ref, cb])
}

const ROLE_STYLE = {
  ADMIN: {
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/25',
    Icon: Shield,
  },
  MEMBER: {
    color: 'text-muted-foreground',
    bg: 'bg-muted/40',
    border: 'border-border/50',
    Icon: User,
  },
} as const

interface MemberRowProps {
  member: MemberWithStats
  isLast: boolean
  isFirst: boolean
  onChangeRole: (id: number, role: 'ADMIN' | 'MEMBER') => void
  onRemove: (id: number) => void
  onViewTasks: (id: number) => void
}

export default function MemberRow({
  member,
  isLast,
  isFirst,
  onChangeRole,
  onRemove,
  onViewTasks,
}: MemberRowProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [roleSubOpen, setRoleSubOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null!)
  useOutsideClick(menuRef, () => {
    setMenuOpen(false)
    setRoleSubOpen(false)
  })

  const role = member.role as 'ADMIN' | 'MEMBER'
  const cfg = ROLE_STYLE[role]
  const RIcon = cfg.Icon
  const pct =
    member.taskTotal > 0 ? Math.round((member.taskDone / member.taskTotal) * 100) : 0
  const color = workloadColor(pct)

  return (
    <div
      className={`group grid grid-cols-[36px_192px_96px_1fr_28px] gap-4 items-center
      px-4 py-3 hover:bg-accent/30 transition-colors duration-100
      ${isFirst ? 'rounded-t-2xl' : ''}
      ${isLast ? 'rounded-b-2xl' : 'border-b border-border/40'}`}
    >
      {/* Avatar — smaller */}
      <div className="shrink-0">
        {member.user.avatarUrl ? (
          <Image
            src={member.user.avatarUrl}
            alt={member.user.fullName}
            width={36}
            height={36}
            className="rounded-xl object-cover ring-1 ring-border/40"
          />
        ) : (
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl
            text-[11px] font-bold ring-1 ring-border/40
            ${role === 'ADMIN' ? 'bg-blue-400/10 text-blue-400' : 'bg-primary/10 text-primary'}`}
          >
            {getInitials(member.user.fullName)}
          </div>
        )}
      </div>

      {/* Name + email */}
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-foreground truncate leading-tight">
          {member.user.fullName}
        </p>
        <p className="text-[10px] text-muted-foreground/45 truncate mt-0.5">
          {member.user.email}
        </p>
      </div>

      {/* Role badge */}
      <div className="min-w-0">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border
          px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider
          ${cfg.color} ${cfg.bg} ${cfg.border}`}
        >
          <RIcon size={9} /> {role.charAt(0) + role.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Workload bar */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: color.bar,
              boxShadow: pct > 0 ? `0 0 5px ${color.bar}88` : 'none',
            }}
          />
        </div>
        <span className={`text-[11px] font-semibold tabular-nums shrink-0 ${color.text}`}>
          {member.taskDone}/{member.taskTotal}
        </span>
        <span className="text-[10px] text-muted-foreground/40 tabular-nums shrink-0 w-8">
          {pct}%
        </span>
      </div>

      {/* ⋯ menu */}
      <div ref={menuRef} className="relative shrink-0">
        <button
          onClick={() => {
            setMenuOpen(v => !v)
            setRoleSubOpen(false)
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg
            text-muted-foreground/30 hover:bg-accent hover:text-muted-foreground
            transition-colors duration-100
            opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={14} />
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 top-full mt-1.5 z-50 w-48
            rounded-xl border border-border bg-background
            shadow-lg shadow-black/10 py-1.5 overflow-hidden"
          >
            <button
              onClick={() => {
                setMenuOpen(false)
                onViewTasks(member.id)
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                text-muted-foreground hover:bg-accent hover:text-foreground
                transition-colors duration-100"
            >
              <LayoutGrid size={12} /> View Assigned Tasks
            </button>

            {/* Change role hover submenu */}
            <div
              className="relative"
              onMouseEnter={() => setRoleSubOpen(true)}
              onMouseLeave={() => setRoleSubOpen(false)}
            >
              <button
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                text-muted-foreground hover:bg-accent hover:text-foreground
                transition-colors duration-100"
              >
                <Shield size={12} /> Change Role
                <ChevronRight size={11} className="ml-auto" />
              </button>

              {roleSubOpen && (
                <div
                  className="absolute right-full top-0 mr-1 w-40
                  rounded-xl border border-border bg-background
                  shadow-lg shadow-black/10 py-1.5 z-50"
                >
                  {(['ADMIN', 'MEMBER'] as const).map(r => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(member.id, r)
                        setMenuOpen(false)
                        setRoleSubOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-xs
                        transition-colors duration-100 hover:bg-accent
                        ${member.role === r ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
                    >
                      {r === 'ADMIN' ? (
                        <Shield size={11} className="text-blue-400" />
                      ) : (
                        <User size={11} className="text-muted-foreground" />
                      )}
                      {r.charAt(0) + r.slice(1).toLowerCase()}
                      {member.role === r && (
                        <CheckCircle2 size={11} className="ml-auto text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="my-1 border-t border-border/60" />

            <button
              onClick={() => {
                setMenuOpen(false)
                onRemove(member.id)
              }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs
                text-red-500 hover:bg-red-500/10 transition-colors duration-100"
            >
              <UserMinus size={12} /> Remove from Project
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
