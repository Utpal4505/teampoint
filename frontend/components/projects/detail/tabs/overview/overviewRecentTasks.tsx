import Image from 'next/image'
import { ArrowRight, CheckCircle2, Clock, Circle, Flag } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { ProjectTask } from '@/features/projects/detail/types'
import type { TabKey } from '../../projectdetailpage'
import { PRIORITY_CONFIG } from '@/features/tasks/constants'
import { PRIORITY_META } from './constants'

interface OverviewRecentTasksProps {
  tasks: ProjectTask[] // already sliced to recent (max 6)
  activeTotal: number // total active (for the sub-label)
  onTabChange: (tab: TabKey) => void
}

export default function OverviewRecentTasks({
  tasks,
  activeTotal,
  onTabChange,
}: OverviewRecentTasksProps) {
  const now = new Date()

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Recent Tasks</h3>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5">
            Showing {tasks.length} of {activeTotal} active tasks
          </p>
        </div>
        <button
          onClick={() => onTabChange('tasks')}
          className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-muted/20
            px-3 py-1.5 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground
            transition-all duration-150"
        >
          View all <ArrowRight size={11} />
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-3 px-3 pb-1.5 border-b border-border/40">
        {[
          { label: 'Task', span: 'col-span-5' },
          { label: 'Status', span: 'col-span-2' },
          { label: 'Priority', span: 'col-span-2' },
          { label: 'Due', span: 'col-span-2' },
          { label: 'Who', span: 'col-span-1 text-right' },
        ].map(h => (
          <span
            key={h.label}
            className={`text-[10px] uppercase tracking-wider text-muted-foreground/40 ${h.span}`}
          >
            {h.label}
          </span>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-sm text-muted-foreground/40">No tasks yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {tasks.map(task => {
            const p = PRIORITY_CONFIG[task.priority as keyof typeof PRIORITY_CONFIG]
            const pm = PRIORITY_META[task.priority as keyof typeof PRIORITY_META]
            const PIcon = pm?.icon ?? Flag

            const accentBar =
              task.status === 'DONE'
                ? 'bg-emerald-400/50'
                : task.status === 'IN_PROGRESS'
                  ? 'bg-amber-400/50'
                  : 'bg-slate-400/25'

            const statusChip =
              task.status === 'DONE'
                ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                : task.status === 'IN_PROGRESS'
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/20'
                  : 'bg-muted/40 text-muted-foreground border-border/40'

            const statusLabel =
              task.status === 'DONE'
                ? 'Done'
                : task.status === 'IN_PROGRESS'
                  ? 'In Progress'
                  : 'Todo'

            const StatusIcon =
              task.status === 'DONE'
                ? CheckCircle2
                : task.status === 'IN_PROGRESS'
                  ? Clock
                  : Circle

            const dueDate = task.dueDate ? new Date(task.dueDate) : null
            const isOverdue = dueDate && dueDate < now && task.status !== 'DONE'
            const dueDateStr = dueDate
              ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—'

            return (
              <div
                key={task.id}
                className="group relative grid grid-cols-12 gap-3 items-center
                  rounded-xl px-3 py-2.5 hover:bg-accent/40 transition-colors duration-150"
              >
                {/* Status accent bar */}
                <div
                  className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-full ${accentBar}`}
                />

                {/* Title */}
                <div className="col-span-5 min-w-0 pl-1">
                  <p className="text-[13px] font-medium text-foreground truncate">
                    {task.title}
                  </p>
                </div>

                {/* Status chip */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border
                    px-2 py-0.5 text-[10px] font-semibold ${statusChip}`}
                  >
                    <StatusIcon size={9} />
                    {statusLabel}
                  </span>
                </div>

                {/* Priority */}
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold
                    ${pm?.text ?? 'text-muted-foreground'}`}
                  >
                    <PIcon size={10} />
                    {p?.label ?? task.priority}
                  </span>
                </div>

                {/* Due date */}
                <div className="col-span-2">
                  <span
                    className={`text-[11px] tabular-nums
                    ${isOverdue ? 'text-red-400 font-semibold' : 'text-muted-foreground/60'}`}
                  >
                    {isOverdue && '! '}
                    {dueDateStr}
                  </span>
                </div>

                {/* Assignee */}
                <div className="col-span-1 flex justify-end">
                  {task.assignedTo ? (
                    <div title={task.assignedTo.name}>
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
                  ) : (
                    <div className="h-[22px] w-[22px] rounded-full border border-dashed border-border/40" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
