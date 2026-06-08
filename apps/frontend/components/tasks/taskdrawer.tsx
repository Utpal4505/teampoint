'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  CalendarDays,
  FolderKanban,
  User,
  Clock,
  ChevronDown,
  Check,
  MessageSquare,
  Plus,
  Edit2,
  XCircle,
  Loader2,
} from 'lucide-react'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/features/tasks/constants'
import { formatDate, getInitials } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { Task, Status } from '@/features/tasks/types'
import { useEffect, useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useDiscussionSocketEvents,
  useProjectDiscussions,
} from '@/features/discussions/hooks'
import NewDiscussionModal from '@/components/projects/detail/tabs/discussions/new-discussion-modal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask } from '@/features/tasks/api'
import { toast } from 'sonner'

interface TaskDrawerProps {
  task: Task | null
  onClose: () => void
  onStatusChange?: (taskId: number, newStatus: Status) => void
  activeTab?: 'overview' | 'discussion'
  onActiveTabChange?: (tab: 'overview' | 'discussion') => void
  workspaceId?: number
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

export default function TaskDrawer({
  task,
  onClose,
  onStatusChange,
  activeTab = 'overview',
  onActiveTabChange,
  workspaceId,
}: TaskDrawerProps) {
  const [discussionModalOpen, setDiscussionModalOpen] = useState(false)
  const [isEditingDueDate, setIsEditingDueDate] = useState(false)
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined,
  )
  const [calendarOpen, setCalendarOpen] = useState(false)
  const queryClient = useQueryClient()

  const updateTaskMutation = useMutation({
    mutationFn: (data: { taskId: number; dueDate: Date | null }) =>
      updateTask(data.taskId, {
        dueDate: data.dueDate ?? undefined,
      }),
    onSuccess: () => {
      toast.success('Due date updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setIsEditingDueDate(false)
      setCalendarOpen(false)
    },
    onError: (error: unknown) => {
      const message =
        typeof error === 'object' && error !== null && 'message' in error
          ? (error as { message: string }).message
          : 'Failed to update due date'
      toast.error(message)
    },
  })

  // Check if date has actually changed
  const hasDateChanged = useCallback((): boolean => {
    if (!task) return false
    const originalDate = task.dueDate ? new Date(task.dueDate).toDateString() : null
    const newDate = editedDueDate ? editedDueDate.toDateString() : null
    return originalDate !== newDate
  }, [task, editedDueDate])

  // Handle keyboard events in edit mode
  useEffect(() => {
    if (!isEditingDueDate || !task) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && hasDateChanged()) {
        updateTaskMutation.mutate({
          taskId: task.id,
          dueDate: editedDueDate ?? null,
        })
      } else if (e.key === 'Escape') {
        setIsEditingDueDate(false)
        setEditedDueDate(task.dueDate ? new Date(task.dueDate) : undefined)
        setCalendarOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isEditingDueDate, task, hasDateChanged, updateTaskMutation, editedDueDate])

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
  const projectId = task?.project?.id ?? null
  const taskDiscussionsQuery = useProjectDiscussions(projectId ?? 0, {
    type: 'TASK',
    contextId: task?.id,
    includeClosed: true,
  })
  useDiscussionSocketEvents(projectId ?? 0)
  const linkedDiscussions = taskDiscussionsQuery.data ?? []
  const showDiscussionTab = !!task?.project

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

            <div className="overflow-y-auto p-5">
              <Tabs
                value={activeTab}
                onValueChange={value =>
                  onActiveTabChange?.(value as 'overview' | 'discussion')
                }
                className="gap-4"
              >
                <TabsList className="bg-muted/40">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  {showDiscussionTab && (
                    <TabsTrigger value="discussion" className="gap-1.5">
                      <MessageSquare size={13} />
                      Discussion
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
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
                      {task.taskType === 'PROJECT' ? (
                        <FolderKanban size={10} />
                      ) : (
                        <User size={10} />
                      )}
                      {task.taskType.charAt(0) + task.taskType.slice(1).toLowerCase()}
                    </span>
                  </div>

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

                    <div className="group flex items-center justify-between gap-4 px-4 py-3">
                      <span className="text-[11px] font-medium text-muted-foreground w-20 shrink-0">
                        Due Date
                      </span>
                      <div className="flex items-center gap-2 justify-end flex-1">
                        {isEditingDueDate ? (
                          <div className="flex flex-col gap-3 w-full">
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                              <PopoverTrigger>
                                <button
                                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg
                                    border border-primary/50 bg-primary/5 text-sm font-medium
                                    text-foreground hover:bg-primary/10 transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <CalendarDays size={14} className="text-primary" />
                                    <span>
                                      {editedDueDate
                                        ? formatDate(
                                            editedDueDate.toISOString().split('T')[0],
                                          )
                                        : 'Select date'}
                                    </span>
                                  </div>
                                  <ChevronDown
                                    size={12}
                                    className="text-muted-foreground"
                                  />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-3 left-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={editedDueDate}
                                  onSelect={date => {
                                    setEditedDueDate(date)
                                  }}
                                  disabled={date =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  className="rounded-lg"
                                />
                              </PopoverContent>
                            </Popover>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  updateTaskMutation.mutate({
                                    taskId: task.id,
                                    dueDate: editedDueDate ?? null,
                                  })
                                }}
                                disabled={
                                  updateTaskMutation.isPending || !hasDateChanged()
                                }
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                                  border border-green-500/50 bg-green-500/8 text-xs font-semibold
                                  text-green-600 hover:bg-green-500/15 transition-colors
                                  disabled:opacity-40 disabled:cursor-not-allowed"
                                title="Save due date (Enter)"
                              >
                                {updateTaskMutation.isPending ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Check size={13} />
                                )}
                                Save
                              </button>

                              <button
                                onClick={() => {
                                  setIsEditingDueDate(false)
                                  setEditedDueDate(
                                    task.dueDate ? new Date(task.dueDate) : undefined,
                                  )
                                  setCalendarOpen(false)
                                }}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg
                                  border border-border bg-muted/40 text-xs font-semibold
                                  text-muted-foreground hover:bg-muted/60 transition-colors"
                                title="Cancel (Esc)"
                              >
                                <XCircle size={13} />
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-end w-full">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays
                                size={13}
                                className="text-muted-foreground shrink-0"
                              />
                              <span
                                className={`text-sm font-medium ${task.dueDate ? 'text-foreground' : 'text-muted-foreground'}`}
                              >
                                {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                setIsEditingDueDate(true)
                                setEditedDueDate(
                                  task.dueDate ? new Date(task.dueDate) : undefined,
                                )
                              }}
                              className="flex items-center gap-1 ml-1 px-2 py-1.5 rounded-md
                                text-muted-foreground hover:text-foreground hover:bg-accent/50
                                transition-colors opacity-0 group-hover:opacity-100"
                              title="Edit due date"
                            >
                              <Edit2 size={13} />
                            </button>
                          </div>
                        )}
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
                            <span className="text-sm text-muted-foreground">
                              Personal
                            </span>
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
                </TabsContent>

                {showDiscussionTab && (
                  <TabsContent value="discussion" className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Linked Discussions
                      </p>
                      <button
                        type="button"
                        onClick={() => setDiscussionModalOpen(true)}
                        className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <Plus size={12} />
                        New
                      </button>
                    </div>

                    {taskDiscussionsQuery.isLoading ? (
                      <div className="rounded-xl border border-border/60 bg-muted/10 p-4 text-sm text-muted-foreground">
                        Loading discussions...
                      </div>
                    ) : linkedDiscussions.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border/60 bg-muted/10 p-4">
                        <p className="text-sm text-foreground">
                          No discussions linked yet.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Start a discussion for this task and it will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {linkedDiscussions.map(discussion => (
                          <Link
                            key={discussion.id}
                            href={`/workspace/${workspaceId}/projects/${task.project?.id}/discussions/${discussion.id}`}
                            className="block rounded-xl border border-border/60 bg-muted/10 p-4 transition-colors hover:border-border hover:bg-accent/20"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-foreground">
                                  {discussion.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                  {discussion.description || 'No description provided.'}
                                </p>
                              </div>
                              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                                {discussion.messageCount}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </>
        )}
      </div>

      {task?.project && (
        <NewDiscussionModal
          open={discussionModalOpen}
          onClose={() => setDiscussionModalOpen(false)}
          projectId={task.project.id}
          linkedTask={{ id: task.id, title: task.title }}
        />
      )}
    </>
  )
}
