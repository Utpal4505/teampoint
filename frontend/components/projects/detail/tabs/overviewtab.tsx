'use client'

import Image from 'next/image'
import { ArrowRight, FileText, Calendar, Users, CheckCircle2, Clock, Circle, TrendingUp } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { ProjectDetail, ProjectTask, ProjectDocument } from '@/features/projects/detail/types'
import type { TabKey } from '../projectdetailpage'
import { PRIORITY_CONFIG } from '@/features/tasks/constants'

interface OverviewTabProps {
  project: ProjectDetail
  tasks: ProjectTask[]
  documents: ProjectDocument[]
  onTabChange: (tab: TabKey) => void
}

// ── Radial progress SVG ───────────────────────────────────────
function RadialProgress({ pct }: { pct: number }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: 136, height: 136 }}>
      <svg width="136" height="136" className="-rotate-90">
        {/* Track */}
        <circle
          cx="68" cy="68" r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/60"
        />
        {/* Fill */}
        <circle
          cx="68" cy="68" r={r}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            stroke: 'url(#progressGrad)',
            filter: 'drop-shadow(0 0 6px oklch(0.6 0.16 262 / 0.7))',
            transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.55 0.18 262)" />
            <stop offset="100%" stopColor="oklch(0.68 0.15 262)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center label */}
      <div className="absolute flex flex-col items-center">
        <span
          className="text-[28px] font-bold tabular-nums leading-none"
          style={{ color: 'oklch(0.65 0.16 262)' }}
        >
          {pct}%
        </span>
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-0.5">
          done
        </span>
      </div>
    </div>
  )
}

// ── Stat pill ─────────────────────────────────────────────────
function StatPill({
  label,
  value,
  Icon,
  color,
  bg,
  glow,
}: {
  label: string
  value: number
  Icon: React.ElementType
  color: string
  bg: string
  glow: string
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl border border-border/50 p-4 ${bg}`}
      style={{ boxShadow: `inset 0 1px 0 ${glow}` }}
    >
      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
        <Icon size={13} className={color} />
      </div>
      <div>
        <p className={`text-2xl font-bold tabular-nums leading-none ${color}`}>{value}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}

export default function OverviewTab({ project, tasks, documents, onTabChange }: OverviewTabProps) {
  const total      = tasks.length
  const done       = tasks.filter(t => t.status === 'DONE').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const todo       = tasks.filter(t => t.status === 'TODO').length
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0

  const recentTasks = tasks.filter(t => t.status !== 'CANCELLED').slice(0, 5)

  // Completion rate label
  const healthLabel =
    pct >= 80 ? 'On Track' :
    pct >= 40 ? 'In Progress' :
    total === 0 ? 'Not Started' : 'Early Stage'

  const healthColor =
    pct >= 80 ? 'text-emerald-400' :
    pct >= 40 ? 'text-amber-400' : 'text-muted-foreground'

  return (
    <div className="p-6 grid grid-cols-12 gap-4 auto-rows-min">

      {/* ── Card 1: Radial Progress ── col-span-4 ────────────── */}
      <div
        className="col-span-4 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4"
        style={{
          background: 'linear-gradient(145deg, hsl(var(--card)) 60%, oklch(0.18 0.04 262) 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Progress</h3>
            <p className={`text-[11px] font-medium mt-0.5 ${healthColor}`}>{healthLabel}</p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp size={13} className="text-primary" />
          </div>
        </div>

        {/* Radial ring centered */}
        <div className="flex justify-center py-1">
          <RadialProgress pct={pct} />
        </div>

        {/* Sub-label */}
        <p className="text-center text-[11px] text-muted-foreground/60 tabular-nums -mt-1">
          {done} of {total} tasks completed
        </p>
      </div>

      {/* ── Card 2: Stat pills ── col-span-8 ─────────────────── */}
      <div className="col-span-8 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-foreground">At a Glance</h3>

        <div className="grid grid-cols-2 gap-3 flex-1">
          <StatPill
            label="Todo"
            value={todo}
            Icon={Circle}
            color="text-slate-300"
            bg="bg-slate-400/5"
            glow="rgba(148,163,184,0.08)"
          />
          <StatPill
            label="In Progress"
            value={inProgress}
            Icon={Clock}
            color="text-amber-400"
            bg="bg-amber-400/5"
            glow="rgba(251,191,36,0.12)"
          />
          <StatPill
            label="Completed"
            value={done}
            Icon={CheckCircle2}
            color="text-emerald-400"
            bg="bg-emerald-400/5"
            glow="rgba(52,211,153,0.12)"
          />
          <StatPill
            label="Members"
            value={project.projectMembers.length}
            Icon={Users}
            color="text-primary"
            bg="bg-primary/5"
            glow="oklch(0.6 0.16 262 / 0.1)"
          />
        </div>
      </div>

      {/* ── Card 3: Recent Tasks ── col-span-7 ───────────────── */}
      <div className="col-span-7 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Recent Tasks</h3>
          <button
            onClick={() => onTabChange('tasks')}
            className="flex items-center gap-1 text-[11px] text-muted-foreground
              hover:text-foreground transition-colors"
          >
            View all <ArrowRight size={11} />
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <p className="text-sm text-muted-foreground/50">No tasks yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {recentTasks.map(task => {
              const p = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG]

              const statusIcon =
                task.status === 'DONE'        ? CheckCircle2 :
                task.status === 'IN_PROGRESS' ? Clock        : Circle

              const statusColor =
                task.status === 'DONE'        ? 'text-emerald-400' :
                task.status === 'IN_PROGRESS' ? 'text-amber-400'   : 'text-slate-400'

              const accentBar =
                task.status === 'DONE'        ? 'bg-emerald-400/50' :
                task.status === 'IN_PROGRESS' ? 'bg-amber-400/50'   : 'bg-slate-400/30'

              const StatusIcon = statusIcon

              return (
                <div
                  key={task.id}
                  className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5
                    hover:bg-accent/40 transition-colors duration-150 cursor-default"
                >
                  {/* Left accent bar */}
                  <div className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${accentBar}`} />

                  <StatusIcon size={13} className={`shrink-0 ${statusColor}`} />

                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-foreground truncate leading-tight">
                      {task.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {p?.label ?? task.priority}
                    </p>
                  </div>

                  {task.assignedTo && (
                    <div className="shrink-0" title={task.assignedTo.name}>
                      {task.assignedTo.avatarUrl ? (
                        <Image
                          src={task.assignedTo.avatarUrl}
                          alt={task.assignedTo.name}
                          width={22}
                          height={22}
                          className="rounded-full ring-1 ring-border/50"
                        />
                      ) : (
                        <div
                          className="flex h-[22px] w-[22px] items-center justify-center
                          rounded-full bg-primary/20 text-[9px] font-bold text-primary"
                        >
                          {getInitials(task.assignedTo.name)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Card 4: Team ── col-span-5 ───────────────────────── */}
      <div className="col-span-5 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Team</h3>
          <button
            onClick={() => onTabChange('members')}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Manage →
          </button>
        </div>

        <div className="flex flex-col gap-1">
          {project.projectMembers.slice(0, 5).map(m => (
            <div
              key={m.user.id}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2
                hover:bg-accent/40 transition-colors duration-150"
            >
              {m.user.avatarUrl ? (
                <Image
                  src={m.user.avatarUrl}
                  alt={m.user.fullName}
                  width={28}
                  height={28}
                  className="rounded-full ring-1 ring-border/50 shrink-0"
                />
              ) : (
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center
                  rounded-full bg-primary/20 text-[10px] font-bold text-primary"
                >
                  {getInitials(m.user.fullName)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-foreground truncate leading-tight">
                  {m.user.fullName}
                </p>
              </div>

              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full shrink-0
                  ${m.role === 'OWNER'
                    ? 'bg-primary/15 text-primary'
                    : m.role === 'ADMIN'
                      ? 'bg-amber-400/15 text-amber-500'
                      : 'bg-muted text-muted-foreground/60'}`}
              >
                {m.role}
              </span>
            </div>
          ))}

          {project.projectMembers.length > 5 && (
            <p className="text-[10px] text-muted-foreground/50 text-center mt-1">
              +{project.projectMembers.length - 5} more
            </p>
          )}
        </div>
      </div>

      {/* ── Card 5: Resources ── col-span-12 ─────────────────── */}
      <div className="col-span-12 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
        <h3 className="text-sm font-bold text-foreground">Resources</h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Documents */}
          <button
            onClick={() => onTabChange('documents')}
            className="group flex items-center gap-4 rounded-xl border border-border/50
              bg-muted/20 p-4 hover:bg-accent/40 hover:border-border/80
              transition-all duration-150 text-left"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
              bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/15 transition-colors"
            >
              <FileText size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Documents</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {documents.length} file{documents.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
            <ArrowRight
              size={14}
              className="text-muted-foreground/40 group-hover:text-muted-foreground
                group-hover:translate-x-0.5 transition-all duration-150"
            />
          </button>

          {/* Meetings */}
          <div
            className="flex items-center gap-4 rounded-xl border border-border/50
              bg-muted/20 p-4 opacity-60 cursor-not-allowed"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
              bg-emerald-500/10 border border-emerald-500/20"
            >
              <Calendar size={16} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Meetings</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}