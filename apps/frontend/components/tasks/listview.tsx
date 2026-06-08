import Image from 'next/image'
import { ChevronDown, Check } from 'lucide-react'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/features/tasks/constants'
import { formatDate, getInitials } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Task, Status } from '@/features/tasks/types'

interface ListViewProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onStatusChange: (taskId: number, newStatus: Status) => void
}

const GRID = '1fr 150px 110px 110px 120px 150px'

export default function ListView({ tasks, onTaskClick, onStatusChange }: ListViewProps) {
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

              {/* Status — dropdown */}
              <div onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`flex items-center gap-1.5 rounded-lg border border-transparent
                      px-2 py-1 text-xs font-medium outline-none transition-all
                      hover:border-border/50 hover:bg-accent/50 ${s.color}`}
                  >
                    <S_Icon size={12} />
                    {s.label}
                    <ChevronDown size={10} className="ml-0.5 opacity-50" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-36">
                    {(Object.keys(STATUS_CONFIG) as Status[])
                      .filter(key => key !== 'CANCELLED')
                      .map(key => (
                        <DropdownMenuItem
                          key={key}
                          onClick={() => onStatusChange(task.id, key)}
                          className="flex items-center justify-between text-[11px] font-medium"
                        >
                          <span
                            className={`flex items-center gap-1.5 ${STATUS_CONFIG[key].color}`}
                          >
                            {(() => {
                              const Icon = STATUS_CONFIG[key].Icon
                              return <Icon size={11} />
                            })()}
                            {STATUS_CONFIG[key].label}
                          </span>
                          {task.status === key && (
                            <Check size={11} className="text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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

              {/* Assignee */}
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
                {task.project?.name || 'Personal'}
              </span>
            </div>
          )
        })
      )}
    </div>
  )
}
