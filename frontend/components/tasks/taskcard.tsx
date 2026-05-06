import { CalendarDays, FolderKanban, User, GripVertical } from 'lucide-react'
import { PRIORITY_CONFIG } from '@/features/tasks/constants'
import type { Task } from '@/features/tasks/types'
import { getInitials } from '@/lib/utils'
import Image from 'next/image'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  dragging?: boolean
  onDragStart?: (e: React.DragEvent, task: Task) => void
  onDragEnd?: () => void
}

function getDaysLeftInfo(dueDate: string, status: string) {
  if (status === 'DONE') {
    return {
      text: 'Completed',
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  const daysLeft = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) {
    return {
      text: `${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''} overdue`,
      color: 'text-red-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    }
  } else if (daysLeft === 0) {
    return {
      text: 'Due today',
      color: 'text-red-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    }
  } else if (daysLeft === 1) {
    return {
      text: '1 day left',
      color: 'text-red-600',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    }
  } else if (daysLeft <= 3) {
    return {
      text: `${daysLeft} days left`,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
    }
  } else if (daysLeft <= 7) {
    return {
      text: `${daysLeft} days left`,
      color: 'text-yellow-600',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
    }
  } else {
    return {
      text: `${daysLeft} days left`,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
    }
  }
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
  const dueDateInfo = task.dueDate ? getDaysLeftInfo(task.dueDate, task.status) : null

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
        {dueDateInfo && (
          <span
            className={`flex items-center gap-1 rounded-md border ${dueDateInfo.border} ${dueDateInfo.bg} px-2 py-0.5 text-[10px] font-semibold ${dueDateInfo.color}`}
          >
            <CalendarDays size={9} />
            {dueDateInfo.text}
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
