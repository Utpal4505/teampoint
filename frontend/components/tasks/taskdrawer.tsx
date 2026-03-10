import Image from 'next/image'
import {
  X,
  CalendarDays,
  FolderKanban,
  User,
  Clock,
  ChevronDown,
  Check,
} from 'lucide-react'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/features/tasks/constants'
import { formatDate, getInitials } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Task, Status } from '@/features/tasks/types'
import { useEffect } from 'react'

interface TaskDrawerProps {
  task: Task | null
  onClose: () => void
  onStatusChange?: (taskId: number, newStatus: Status) => void
}

function AssigneeAvatar({ task }: { task: Task }) {
  return task.avatarUrl ? (
    <Image
      src={task.avatarUrl}
      alt={task.assignee ?? ''}
      width={22}
      height={22}
      className="rounded-full object-cover ring-1 ring-border/60 shrink-0"
    />
  ) : (
    <div
      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center
      rounded-full bg-primary/20 text-[9px] font-bold text-primary ring-1 ring-primary/30"
    >
      {getInitials(task.assignee ?? '')}
    </div>
  )
}

export default function TaskDrawer({ task, onClose, onStatusChange }: TaskDrawerProps) {
  useEffect(() => {
    if (task) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [task])

  const p = task ? PRIORITY_CONFIG[task.priority] : null
  const s = task ? STATUS_CONFIG[task.status] : null

  return (
    <>
      <div
        className={`fixed inset-0 z-40 transition-all duration-300
          ${task ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        style={{ background: 'oklch(0 0 0 / 0.55)' }}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[380px] flex-col
          border-l border-border bg-card
          shadow-[-32px_0_80px_oklch(0_0_0/0.6)]
          transition-transform duration-300 ease-out
          ${task ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {task && p && s && (
          <>
            <div
              className="h-[2px] w-full shrink-0"
              style={{
                background:
                  'linear-gradient(90deg,transparent,oklch(0.6 0.16 262/0.9) 50%,transparent)',
              }}
            />

            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 shrink-0">
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-base font-bold leading-snug text-foreground">
                  {task.title}
                </h2>
                {task.project && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FolderKanban size={11} />
                    <span className="truncate">{task.project.name}</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg
                  text-muted-foreground transition-all duration-150
                  hover:bg-destructive/10 hover:text-destructive"
              >
                <X size={14} />
              </button>
            </div>

            <div className="h-px bg-border/60 mx-5 shrink-0" />

            <div className="flex flex-col gap-4 overflow-y-auto p-5">
              {/* Status + Priority chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status — dropdown */}
                {onStatusChange ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
                        text-[11px] font-semibold border outline-none transition-all
                        hover:opacity-80 ${s.color} ${s.bg}`}
                    >
                      <s.Icon size={11} /> {s.label}
                      <ChevronDown size={10} className="ml-0.5 opacity-60" />
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
                ) : (
                  <span
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
                    text-[11px] font-semibold border ${s.color} ${s.bg}`}
                  >
                    <s.Icon size={11} /> {s.label}
                  </span>
                )}

                {/* Priority chip */}
                <span
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
                  text-[11px] font-semibold border ${p.color} ${p.bg}`}
                >
                  <p.Icon size={11} /> {p.label}
                </span>

                <span
                  className="flex items-center gap-1 rounded-lg border border-border
                  bg-muted/40 px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground"
                >
                  {task.type === 'PROJECT' ? (
                    <FolderKanban size={10} />
                  ) : (
                    <User size={10} />
                  )}
                  {task.type.charAt(0) + task.type.slice(1).toLowerCase()}
                </span>
              </div>

              {/* Details card */}
              <div className="rounded-xl border border-border/60 bg-muted/10 divide-y divide-border/40">
                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-[11px] font-medium text-muted-foreground w-20 shrink-0">
                    Assignee
                  </span>
                  <div className="flex items-center gap-2 min-w-0">
                    <AssigneeAvatar task={task} />
                    <span className="text-sm text-foreground truncate">
                      {task.assignee ?? 'Unassigned'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-[11px] font-medium text-muted-foreground w-20 shrink-0">
                    Due Date
                  </span>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={12} className="text-muted-foreground shrink-0" />
                    <span
                      className={`text-sm ${task.dueDate ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-[11px] font-medium text-muted-foreground w-20 shrink-0">
                    Project
                  </span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    {task.project ? (
                      <>
                        <FolderKanban
                          size={12}
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="text-sm text-foreground truncate">
                          {task.project.name}
                        </span>
                      </>
                    ) : (
                      <>
                        <User size={12} className="text-muted-foreground shrink-0" />
                        <span className="text-sm text-muted-foreground">Personal</span>
                      </>
                    )}
                  </div>
                </div>

                {task.dueDate && (
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <span className="text-[11px] font-medium text-muted-foreground w-20 shrink-0">
                      Created
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-muted-foreground shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Description
                </p>
                <p
                  className={`rounded-xl border border-border/60 bg-muted/10 p-4
                  text-sm leading-relaxed min-h-[90px]
                  ${task.description ? 'text-foreground/80' : 'text-muted-foreground/50 italic'}`}
                >
                  {task.description || 'No description provided.'}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
