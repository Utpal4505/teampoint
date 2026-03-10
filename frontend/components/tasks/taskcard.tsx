import { CalendarDays, FolderKanban, User, GripVertical } from 'lucide-react'
import { PRIORITY_CONFIG } from '@/features/tasks/constants'
import type { Task } from '@/features/tasks/types'
import { formatDate, getInitials } from '@/lib/utils'
import Image from 'next/image'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  dragging?: boolean
  onDragStart?: (e: React.DragEvent, task: Task) => void
  onDragEnd?: () => void
}

export default function TaskCard({
  task,
  onClick,
  dragging,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const p = PRIORITY_CONFIG[task.priority]
  const P_Icon = p.Icon

  console.log(task.avatarUrl)

  return (
    <div
      draggable
      onDragStart={e => onDragStart?.(e, task)}
      onClick={() => onClick(task)}
      onDragEnd={onDragEnd}
      className={`group cursor-pointer rounded-xl border border-border bg-card p-3.5 transition-all duration-150
        hover:border-border/80 hover:shadow-[0_4px_20px_oklch(0_0_0/0.3)] hover:-translate-y-px
        ${dragging ? 'opacity-50 rotate-2 scale-[0.98]' : ''}`}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug text-foreground/90 group-hover:text-foreground transition-colors">
          {task.title}
        </p>
        <GripVertical
          size={13}
          className="mt-0.5 shrink-0 text-muted-foreground/30 group-hover:text-muted-foreground/60"
        />
      </div>

      <div className="mb-2.5 flex items-center gap-2 flex-wrap">
        <span
          className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${p.color} ${p.bg}`}
        >
          <P_Icon size={9} />
          {p.label}
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1 rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] text-muted-foreground">
            <CalendarDays size={9} />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {task.project ? (
            <>
              <FolderKanban size={10} />
              <span className="truncate max-w-[100px]">{task.project.name}</span>
            </>
          ) : (
            <>
              <User size={10} />
              <span>Personal</span>
            </>
          )}
        </div>

        {/* Avatar ? Avatar : Initials */}
        {task.assignee &&
          (task.avatarUrl ? (
            <Image
              src={task.avatarUrl}
              alt={task.assignee}
              width={20}
              height={20}
              className="rounded-full object-cover ring-1 ring-border/50"
            />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[9px] font-bold text-muted-foreground ring-1 ring-border/50">
              {getInitials(task.assignee)}
            </div>
          ))}
      </div>
    </div>
  )
}
