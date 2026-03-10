import Image from 'next/image'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/features/tasks/constants'
import { formatDate, getInitials } from '@/lib/utils'
import type { Task } from '@/features/tasks/types'

interface ListViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

const GRID = '1fr 130px 110px 110px 120px 150px'

export default function ListView({ tasks, onTaskClick }: ListViewProps) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div
        className="grid border-b border-border bg-muted/30 px-4 py-2.5
          text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
        style={{ gridTemplateColumns: GRID }}
      >
        <span>Title</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Due Date</span>
        <span>Assignee</span>
        <span>Project</span>
      </div>

      {tasks.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          No tasks found.
        </div>
      ) : (
        tasks.map((task, i) => {
          const p = PRIORITY_CONFIG[task.priority]
          const s = STATUS_CONFIG[task.status]
          const P_Icon = p.Icon
          const S_Icon = s.Icon

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={`grid cursor-pointer items-center px-4 py-3 text-sm
                transition-colors hover:bg-accent/40
                ${i !== tasks.length - 1 ? 'border-b border-border/50' : ''}`}
              style={{ gridTemplateColumns: GRID }}
            >
              {/* Title */}
              <span className="font-medium text-foreground/90 truncate pr-4">
                {task.title}
              </span>

              {/* Status */}
              <span
                className={`flex items-center gap-1.5 text-xs font-medium ${s.color}`}
              >
                <S_Icon size={12} />
                {s.label}
              </span>

              {/* Priority */}
              <span
                className={`flex items-center gap-1 rounded-md border px-2 py-0.5 w-fit
                text-[10px] font-bold uppercase tracking-wider ${p.color} ${p.bg}`}
              >
                <P_Icon size={9} />
                {p.label}
              </span>

              {/* Due Date */}
              <span className="text-xs text-muted-foreground">
                {task.dueDate ? formatDate(task.dueDate) : '—'}
              </span>

              {/* Assignee — avatar + name */}
              <div className="flex items-center gap-2">
                {task.avatarUrl ? (
                  <Image
                    src={task.avatarUrl}
                    alt={task.assignee ?? ''}
                    width={20}
                    height={20}
                    className="rounded-full object-cover ring-1 ring-border/50 shrink-0"
                  />
                ) : (
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center
                    rounded-full bg-muted text-[9px] font-bold text-muted-foreground
                    ring-1 ring-border/50"
                  >
                    {getInitials(task.assignee ?? '')}
                  </div>
                )}
                <span className="truncate text-xs text-muted-foreground">
                  {task.assignee ?? '—'}
                </span>
              </div>

              {/* Project */}
              <span className="truncate text-xs text-muted-foreground">
                {task.project || 'Personal'}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
