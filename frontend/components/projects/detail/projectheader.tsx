'use client'

import Image from 'next/image'
import { UserPlus } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { ProjectDetail, ProjectTask } from '@/features/projects/detail/types'
import ProjectMenu from './projectmenu'
import StatusBadge from './statusbadge'
import type { ModalState } from './projectdetailpage'

interface ProjectHeaderProps {
  project: ProjectDetail
  tasks: ProjectTask[]
  onOpenModal: (modal: ModalState) => void
}

export default function ProjectHeader({ project, tasks, onOpenModal }: ProjectHeaderProps) {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'DONE').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const todo = tasks.filter(t => t.status === 'TODO').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="px-6 py-5 flex flex-col gap-4">

      {/* Row 1 — Title + Status */}
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <h1 className="font-display text-[22px] font-bold text-foreground leading-tight">
            {project.name}
          </h1>
          <StatusBadge status={project.status} projectId={project.id} />
        </div>
        {project.description && (
          <p className="mt-1 text-[13px] text-muted-foreground max-w-xl leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {/* Row 2 — Members + Invite + Menu */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Stacked avatars */}
          <button
            onClick={() => onOpenModal({ type: 'members' })}
            className="flex items-center group"
          >
            {project.projectMembers.slice(0, 4).map((m, i) => (
              <div
                key={m.user.id}
                title={m.user.fullName}
                className="relative transition-transform duration-150 group-hover:scale-105"
                style={{ marginLeft: i === 0 ? 0 : -9, zIndex: 4 - i }}
              >
                {m.user.avatarUrl ? (
                  <Image
                    src={m.user.avatarUrl}
                    alt={m.user.fullName}
                    width={30}
                    height={30}
                    className="rounded-full ring-2 ring-background object-cover"
                  />
                ) : (
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full
                    bg-primary/20 text-[10px] font-bold text-primary ring-2 ring-background">
                    {getInitials(m.user.fullName)}
                  </div>
                )}
              </div>
            ))}
            {project.projectMembers.length > 4 && (
              <div
                className="flex h-[30px] w-[30px] items-center justify-center rounded-full
                bg-muted text-[10px] font-semibold text-muted-foreground ring-2 ring-background"
                style={{ marginLeft: -9, zIndex: 0 }}
              >
                +{project.projectMembers.length - 4}
              </div>
            )}
          </button>

          <span className="text-[11px] text-muted-foreground">
            {project.projectMembers.length} member{project.projectMembers.length !== 1 ? 's' : ''}
          </span>

          <div className="h-4 w-px bg-border/60" />

          <button
            onClick={() => onOpenModal({ type: 'members' })}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-background
              px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-150
              hover:bg-accent hover:text-foreground"
          >
            <UserPlus size={13} /> Invite
          </button>
        </div>

        <ProjectMenu project={project} onOpenModal={onOpenModal} />
      </div>

      {/* Row 3 — Progress card */}
      <div className="rounded-2xl border border-border/60 bg-muted/20 px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Progress
          </span>
          <span className="text-[13px] font-bold tabular-nums text-foreground">{pct}%</span>
        </div>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, oklch(0.55 0.18 262), oklch(0.65 0.16 262))',
              boxShadow: pct > 0 ? '0 0 8px oklch(0.6 0.16 262 / 0.4)' : 'none',
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {done} / {total} tasks completed
          </span>
          <div className="flex items-center gap-3 text-[11px] tabular-nums">
            <span className="text-muted-foreground">{todo} Todo</span>
            <span className="text-border">•</span>
            <span className="text-amber-400">{inProgress} In Progress</span>
            <span className="text-border">•</span>
            <span className="text-emerald-400">{done} Done</span>
          </div>
        </div>
      </div>

    </div>
  )
}