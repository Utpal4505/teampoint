'use client'

import { useState } from 'react'
import { FolderKanban, CheckSquare, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KanbanPreview } from './hero'

function ProjectsVisual() {
  const projects = [
    { name: 'Design Engineering', status: 'ACTIVE', statusColor: 'text-emerald-400 bg-emerald-400/10', tasks: 18, total: 40 },
    { name: 'Sales & Marketing', status: 'ON HOLD', statusColor: 'text-amber-400 bg-amber-400/10', tasks: 9, total: 24 },
    { name: 'Mobile App v2', status: 'ACTIVE', statusColor: 'text-emerald-400 bg-emerald-400/10', tasks: 61, total: 61 },
  ]
  return (
    <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur p-4 flex flex-col gap-3">
      {projects.map((p, i) => (
        <div key={i} className="rounded-xl border border-border/30 bg-foreground/[0.02] p-4 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', p.statusColor)}>{p.status}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-foreground/[0.06] overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((p.tasks / p.total) * 100)}%` }} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground shrink-0">{p.tasks}/{p.total}</span>
        </div>
      ))}
    </div>
  )
}

function OverviewVisual() {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/80 backdrop-blur p-5 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ label: 'Total Tasks', value: '24', color: 'text-foreground' }, { label: 'In Progress', value: '8', color: 'text-amber-400' }, { label: 'Done', value: '13', color: 'text-emerald-400' }].map((s, i) => (
          <div key={i} className="rounded-xl border border-border/30 bg-foreground/[0.02] p-3 text-center">
            <p className={cn("text-xl font-bold font-display", s.color)}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/30 bg-foreground/[0.02] p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-foreground">Progress</p>
          <p className="text-xs text-primary font-bold">54%</p>
        </div>
        <div className="h-2 rounded-full bg-foreground/[0.06] overflow-hidden">
          <div className="h-full w-[54%] rounded-full bg-primary" />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">13 / 24 tasks completed</p>
      </div>
      <div className="rounded-xl border border-border/30 bg-foreground/[0.02] p-4">
        <p className="text-xs font-semibold text-foreground mb-3">Team Workload</p>
        {[{ name: 'Utpal', tasks: 8 }, { name: 'Priya', tasks: 5 }].map((m, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
              {m.name[0]}
            </div>
            <span className="text-xs text-muted-foreground flex-1">{m.name}</span>
            <span className="text-xs text-foreground">{m.tasks} tasks</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductFlows() {
  const [active, setActive] = useState(0)

  const flows = [
    { label: 'Projects', icon: FolderKanban, heading: 'All your projects, one place', sub: 'Create workspaces, invite your team, and start tracking progress from day one.', visual: <ProjectsVisual /> },
    { label: 'Tasks', icon: CheckSquare, heading: 'Kanban that actually works', sub: 'Drag, drop, and ship. See task priority, due dates, and assignees at a glance.', visual: <KanbanPreview /> },
    { label: 'Overview', icon: BarChart2, heading: 'Know where things stand', sub: 'Progress bars, team workload, overdue alerts — no meeting required.', visual: <OverviewVisual /> },
  ]

  return (
    <section className="py-28 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/[0.04] px-3.5 py-1.5 mb-5">
            <span className="text-xs font-medium text-muted-foreground">Product flows</span>
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight">See it in action</h2>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          {flows.map((f, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-display font-semibold transition-all duration-200',
                active === i
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_var(--color-primary)]/30'
                  : 'text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/60',
              )}
            >
              <f.icon size={14} />
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-display text-3xl font-bold text-foreground mb-4">{flows[active].heading}</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">{flows[active].sub}</p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl -z-10 scale-95" />
            {flows[active].visual}
          </div>
        </div>
      </div>
    </section>
  )
}