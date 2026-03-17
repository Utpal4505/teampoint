'use client'

import Image from 'next/image'
import { Project } from '@/features/projects/types'
import { STATUS_CONFIG } from '@/features/projects/constants'
import { useEffect, useRef, useState } from 'react'
import {
  MoreHorizontal,
  CheckSquare,
  FolderKanban,
  ExternalLink,
  Pencil,
  Users,
  Archive,
  Trash2,
} from 'lucide-react'

interface ProjectCardProps {
  project: Project
  onClick: (project: Project) => void
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

const GLOW_MAP: Record<string, string> = {
  'bg-emerald-500': 'oklch(0.74 0.18 155 / 0.07)',
  'bg-amber-500': 'oklch(0.80 0.17  80 / 0.07)',
  'bg-blue-500': 'oklch(0.65 0.20 250 / 0.07)',
}

function MemberAvatar({
  member,
  index,
  total,
}: {
  member: Project['members'][0]
  index: number
  total: number
}) {
  return (
    <div
      className="relative"
      style={{ marginLeft: index === 0 ? 0 : '-7px', zIndex: total - index }}
    >
      {member.avatarUrl ? (
        <Image
          src={member.avatarUrl}
          alt={member.name}
          width={24}
          height={24}
          className="rounded-full object-cover ring-2 ring-card"
        />
      ) : (
        <div
          className="flex h-6 w-6 items-center justify-center rounded-full
          bg-primary/20 text-[8px] font-bold text-primary ring-2 ring-card"
        >
          {getInitials(member.name)}
        </div>
      )}
    </div>
  )
}

function ProjectMenu({ onStop }: { onStop: (e: React.MouseEvent) => void }) {
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
    { icon: ExternalLink, label: 'Open Project', className: 'text-foreground' },
    { icon: Pencil, label: 'Edit Project', className: 'text-foreground' },
    { icon: Users, label: 'Manage Members', className: 'text-foreground' },
    { icon: Archive, label: 'Archive Project', className: 'text-foreground' },
    {
      icon: Trash2,
      label: 'Delete Project',
      className: 'text-destructive',
      danger: true,
    },
  ]

  return (
    <div ref={ref} className="relative" onClick={onStop}>
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
              : 'border-border/50 bg-card text-muted-foreground hover:bg-accent hover:text-foreground'
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
          {items.map((item, i) => (
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

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  console.log(project)
  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG['ACTIVE']
  const pct =
    project.totalTasks > 0
      ? Math.round((project.doneTasks / project.totalTasks) * 100)
      : 0
  const visible = project.members.slice(0, MAX_AVATARS)
  const extra = project.members.length - MAX_AVATARS
  const glowClr = GLOW_MAP[cfg.barColor] ?? 'transparent'

  return (
    <div
      onClick={() => onClick(project)}
      className="group relative flex flex-col rounded-2xl border border-border bg-card
        cursor-pointer transition-all duration-200
        hover:border-border/70 hover:shadow-[0_8px_40px_oklch(0_0_0/0.35)]
        hover:-translate-y-0.5"
    >
      {/* Card glow bg */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${glowClr}, transparent)`,
        }}
      />

      <div className="flex flex-col gap-0 p-4 pt-3.5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
              border ${cfg.border} ${cfg.bg}`}
            >
              <FolderKanban size={16} className={cfg.color} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground leading-tight">
                {project.name}
              </p>
              <span
                className={`inline-flex items-center gap-1 mt-0.5
                text-[10px] font-semibold uppercase tracking-wider ${cfg.color}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
          </div>
          <ProjectMenu onStop={e => e.stopPropagation()} />
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 min-h-[32px]">
          {project.description}
        </p>

        {/* Progress section */}
        <div className={`rounded-xl border ${cfg.border} ${cfg.bg} p-3 mb-3`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckSquare size={11} className="shrink-0" />
              <span>
                <span className={`font-bold ${cfg.color}`}>{project.doneTasks}</span>
                <span className="text-muted-foreground/60">
                  {' '}
                  / {project.totalTasks} tasks
                </span>
              </span>
            </div>
            <span className={`text-xs font-bold tabular-nums ${cfg.color}`}>{pct}%</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/60">
            <div
              className={`h-full rounded-full transition-all duration-700 ${cfg.barColor}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-0.5">
          {/* Avatars */}
          <div className="flex items-center">
            {visible.map((member, i) => (
              <MemberAvatar
                key={member.id}
                member={member}
                index={i}
                total={visible.length}
              />
            ))}
            {extra > 0 && (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full
                bg-muted text-[8px] font-bold text-muted-foreground ring-2 ring-card"
                style={{ marginLeft: '-7px', zIndex: 0 }}
              >
                +{extra}
              </div>
            )}
          </div>

          <span className="text-[11px] text-muted-foreground/50 tabular-nums">
            {formatDate(project.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
