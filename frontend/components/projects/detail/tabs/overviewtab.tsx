'use client'

import Image from 'next/image'
import { ArrowRight, FileText, Calendar, Users, CheckCircle2, Clock, Circle } from 'lucide-react'
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

export default function OverviewTab({ project, tasks, documents, onTabChange }: OverviewTabProps) {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'DONE').length
  const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length
  const todo = tasks.filter(t => t.status === 'TODO').length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const recentTasks = [...tasks]
    .filter(t => t.status !== 'CANCELLED')
    .slice(0, 5)

  return (
    <div className="p-6 grid grid-cols-4 gap-4 auto-rows-min">

      {/* 1 — Progress Card */}
      <div className="col-span-2 rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground">Project Progress</h3>
          <span className="text-2xl font-bold text-primary tabular-nums">{pct}%</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {done} / {total} tasks completed
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Todo', value: todo, Icon: Circle, color: 'text-slate-400' },
            { label: 'In Progress', value: inProgress, Icon: Clock, color: 'text-amber-400' },
            { label: 'Done', value: done, Icon: CheckCircle2, color: 'text-emerald-400' },
          ].map(s => (
            <div
              key={s.label}
              className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/20 p-3"
            >
              <s.Icon size={14} className={s.color} />
              <span className="text-lg font-bold text-foreground tabular-nums">{s.value}</span>
              <span className="text-[10px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2 — Stats Card */}
      <div className="col-span-2 rounded-2xl border border-border bg-card p-5 flex flex-col gap-4">
        <h3 className="font-display text-sm font-bold text-foreground">Project Stats</h3>
        <div className="grid grid-cols-2 gap-3 flex-1">
          {[
            { label: 'Tasks', value: total, Icon: CheckCircle2 },
            { label: 'Members', value: project.projectMembers.length, Icon: Users },
            { label: 'Documents', value: documents.length, Icon: FileText },
            { label: 'Meetings', value: 0, Icon: Calendar },
          ].map(s => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <s.Icon size={14} className="text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 — Recent Tasks */}
      <div className="col-span-4 rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground">Recent Tasks</h3>
          <button
            onClick={() => onTabChange('tasks')}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ArrowRight size={11} />
          </button>
        </div>

        {recentTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No tasks yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border/40">
            {recentTasks.map(task => {
              const p = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG]
              const statusColor =
                task.status === 'DONE' ? 'text-emerald-400' :
                task.status === 'IN_PROGRESS' ? 'text-amber-400' : 'text-slate-400'
              const statusLabel =
                task.status === 'DONE' ? 'Done' :
                task.status === 'IN_PROGRESS' ? 'In Progress' : 'Todo'

              return (
                <div key={task.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <p className={`text-[11px] ${statusColor}`}>
                      {statusLabel} • {p?.label ?? task.priority}
                    </p>
                  </div>
                  {task.assignedTo && (
                    <div className="shrink-0" title={task.assignedTo.name}>
                      {task.assignedTo.avatarUrl ? (
                        <Image
                          src={task.assignedTo.avatarUrl}
                          alt={task.assignedTo.name}
                          width={24}
                          height={24}
                          className="rounded-full ring-1 ring-border/50"
                        />
                      ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary">
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

      {/* 4 — Team Members */}
      <div className="col-span-2 rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-foreground">Team Members</h3>
          <button
            onClick={() => onTabChange('members')}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Manage
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {project.projectMembers.slice(0, 5).map(m => (
            <div key={m.user.id} className="flex items-center gap-2.5">
              {m.user.avatarUrl ? (
                <Image
                  src={m.user.avatarUrl}
                  alt={m.user.fullName}
                  width={28}
                  height={28}
                  className="rounded-full ring-1 ring-border/50 shrink-0"
                />
              ) : (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                  {getInitials(m.user.fullName)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{m.user.fullName}</p>
                <p className="text-[10px] text-muted-foreground capitalize">
                  {m.role.toLowerCase()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 — Resources */}
      <div className="col-span-2 rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
        <h3 className="font-display text-sm font-bold text-foreground">Resources</h3>
        <div className="flex flex-col gap-3">
          <div
            className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 cursor-pointer hover:bg-accent/40 transition-colors"
            onClick={() => onTabChange('documents')}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                <FileText size={14} className="text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Documents</p>
                <p className="text-[10px] text-muted-foreground">{documents.length} files</p>
              </div>
            </div>
            <ArrowRight size={13} className="text-muted-foreground" />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-3 cursor-pointer hover:bg-accent/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                <Calendar size={14} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Meetings</p>
                <p className="text-[10px] text-muted-foreground">0 scheduled</p>
              </div>
            </div>
            <ArrowRight size={13} className="text-muted-foreground" />
          </div>
        </div>
      </div>

    </div>
  )
}