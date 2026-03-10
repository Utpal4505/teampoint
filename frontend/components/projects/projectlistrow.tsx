'use client'

import Image from 'next/image'
import {
  MoreHorizontal,
  FolderKanban,
  ExternalLink,
  Pencil,
  Users,
  Archive,
  Trash2,
} from 'lucide-react'
import { Project } from '@/features/projects/types'
import { STATUS_CONFIG } from '@/features/projects/constants'
import { useEffect, useRef, useState } from 'react'

interface ProjectListRowProps {
  project: Project
  onClick: (project: Project) => void
  last: boolean
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const MAX_AVATARS = 4
const GRID = '2fr 120px 200px 110px 130px 44px'

function RowMenu({ onStop }: { onStop: (e: React.MouseEvent) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const items = [
    { icon: ExternalLink, label: 'Open Project' },
    { icon: Pencil, label: 'Edit Project' },
    { icon: Users, label: 'Manage Members' },
    { icon: Archive, label: 'Archive Project' },
    { icon: Trash2, label: 'Delete Project', danger: true },
  ]

  return (
    <div ref={ref} className="relative flex justify-center" onClick={onStop}>
      <button
        onClick={e => {
          onStop(e)
          setOpen(o => !o)
        }}
        className={`flex h-7 w-7 items-center justify-center rounded-lg border
          transition-all duration-150
          ${
            open
              ? 'border-border bg-accent text-foreground'
              : 'border-border/40 text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border'
          }`}
      >
        <MoreHorizontal size={14} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-[calc(100%+6px)] z-50 w-48
          overflow-hidden rounded-xl border border-border bg-card
          shadow-[0_12px_40px_oklch(0_0_0/0.5)]
          animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right"
        >
          {items.map(item => (
            <div key={item.label}>
              {item.danger && <div className="mx-2 my-1 h-px bg-border/60" />}
              <button
                onClick={e => {
                  onStop(e)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium
                  transition-colors duration-100
                  ${
                    item.danger
                      ? 'text-destructive hover:bg-destructive/10'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
              >
                <item.icon size={13} className="shrink-0" />
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectListRow({ project, onClick, last }: ProjectListRowProps) {
  const cfg = STATUS_CONFIG[project.status]
  const pct =
    project.totalTasks > 0
      ? Math.round((project.doneTasks / project.totalTasks) * 100)
      : 0
  const visible = project.members.slice(0, MAX_AVATARS)
  const extra = project.members.length - MAX_AVATARS

  return (
    <div
      onClick={() => onClick(project)}
      className={`group grid cursor-pointer items-center px-5 py-3.5
        transition-colors duration-150 hover:bg-accent/25
        ${!last ? 'border-b border-border/40' : ''}`}
      style={{ gridTemplateColumns: GRID }}
    >
      {/* Name + description */}
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl
          border ${cfg.border} ${cfg.bg}`}
        >
          <FolderKanban size={14} className={cfg.color} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground leading-tight">
            {project.name}
          </p>
          <p className="truncate text-[11px] text-muted-foreground/70 mt-0.5 leading-tight">
            {project.description}
          </p>
        </div>
      </div>

      {/* Status */}
      <div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1
          text-[10px] font-semibold uppercase tracking-wider ${cfg.color} ${cfg.bg} ${cfg.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          {cfg.label}
        </span>
      </div>

      {/* Progress — bar + % + fraction */}
      <div className="flex items-center gap-3 pr-4">
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cfg.barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground/50 tabular-nums">
              {project.doneTasks} / {project.totalTasks} tasks
            </span>
            <span className={`text-[10px] font-bold tabular-nums ${cfg.color}`}>
              {pct}%
            </span>
          </div>
        </div>
      </div>

      {/* Created date */}
      <div className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</div>

      {/* Members */}
      <div className="flex items-center">
        {visible.map((member, i) => (
          <div
            key={member.id}
            className="relative"
            style={{ marginLeft: i === 0 ? 0 : '-6px', zIndex: visible.length - i }}
          >
            {member.avatarUrl ? (
              <Image
                src={member.avatarUrl}
                alt={member.name}
                width={22}
                height={22}
                className="rounded-full object-cover ring-2 ring-card"
              />
            ) : (
              <div
                className="flex h-[22px] w-[22px] items-center justify-center
                rounded-full bg-primary/20 text-[8px] font-bold text-primary ring-2 ring-card"
              >
                {getInitials(member.name)}
              </div>
            )}
          </div>
        ))}
        {extra > 0 && (
          <div
            className="flex h-[22px] w-[22px] items-center justify-center rounded-full
            bg-muted text-[8px] font-bold text-muted-foreground ring-2 ring-card"
            style={{ marginLeft: '-6px', zIndex: 0 }}
          >
            +{extra}
          </div>
        )}
      </div>

      {/* Actions — always visible */}
      <RowMenu onStop={e => e.stopPropagation()} />
    </div>
  )
}
