'use client'

import React, { useState } from 'react'
import {
  Plus,
  ArrowRight,
  Circle,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  Minus,
  ArrowDown,
  ChevronDown,
  Check,
} from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskCreateModal, TaskCreatePayload } from '../tasks/taskcreatemodal'

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED'

interface Task {
  id: string
  title: string
  priority: Priority
  status: TaskStatus
  completed: boolean
}

const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; icon: React.ElementType }
> = {
  URGENT: { label: 'Urgent', color: 'text-red-500 bg-red-500/10', icon: AlertCircle },
  HIGH: { label: 'High', color: 'text-orange-500 bg-orange-500/10', icon: ArrowUp },
  MEDIUM: { label: 'Medium', color: 'text-blue-400 bg-blue-400/10', icon: Minus },
  LOW: { label: 'Low', color: 'text-slate-500 bg-slate-500/10', icon: ArrowDown },
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  TODO: { label: 'Todo', color: 'text-slate-400 bg-slate-400/10' },
  IN_PROGRESS: { label: 'In Progress', color: 'text-amber-500 bg-amber-500/10' },
  DONE: { label: 'Done', color: 'text-emerald-500 bg-emerald-500/10' },
  CANCELLED: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10' },
}

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Fix login bug',
    priority: 'URGENT',
    status: 'IN_PROGRESS',
    completed: false,
  },
  {
    id: '2',
    title: 'Prepare pitch deck',
    priority: 'HIGH',
    status: 'TODO',
    completed: false,
  },
  {
    id: '3',
    title: 'Review pull request',
    priority: 'MEDIUM',
    status: 'TODO',
    completed: false,
  },
  {
    id: '4',
    title: 'Update landing copy',
    priority: 'MEDIUM',
    status: 'TODO',
    completed: false,
  },
  {
    id: '5',
    title: 'Setup CI pipeline',
    priority: 'HIGH',
    status: 'TODO',
    completed: false,
  },
  {
    id: '6',
    title: 'Write release notes',
    priority: 'LOW',
    status: 'TODO',
    completed: false,
  },
]

export function MyTasksCard() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS)
  const [modalOpen, setModalOpen] = useState(false)

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
  }

  async function handleCreateTask(payload: TaskCreatePayload) {
    const newTask: Task = {
      id: Date.now().toString(),
      title: payload.title,
      priority: payload.priority,
      status: 'TODO',
      completed: false,
    }
    setTasks(p => [newTask, ...p].slice(0, 6)) //
    setModalOpen(false)
  }

  const done = tasks.filter(t => t.completed).length
  const total = tasks.length

  return (
    <>
      <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-4">
          <div className="space-y-1">
            <h2 className="font-display text-sm font-bold text-foreground">My Tasks</h2>
            <div className="flex items-center gap-2">
              <div className="h-1 w-24 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(done / total) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {done}/{total} done
              </span>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          >
            <Plus size={14} /> New Task
          </button>
        </div>

        <div className="flex flex-col px-2 pb-2">
          {tasks.slice(0, 6).map(task => {
            const P_Icon = PRIORITY_CONFIG[task.priority].icon
            const p = PRIORITY_CONFIG[task.priority]
            const s = STATUS_CONFIG[task.status]

            return (
              <div
                key={task.id}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent/40 transition-colors"
              >
                <button
                  onClick={() =>
                    updateTask(task.id, {
                      completed: !task.completed,
                      status: !task.completed ? 'DONE' : 'TODO',
                    })
                  }
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {task.completed ? (
                    <CheckCircle2 size={18} className="text-primary fill-primary/10" />
                  ) : (
                    <Circle
                      size={18}
                      className="text-muted-foreground/30 group-hover:text-muted-foreground/60"
                    />
                  )}
                </button>

                <span
                  className={`flex-1 truncate text-sm font-medium transition-all ${task.completed ? 'text-muted-foreground/60 line-through' : 'text-foreground/90'}`}
                >
                  {task.title}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      className={`flex w-28 items-center justify-between rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider outline-none border border-transparent transition-all hover:border-border/50 ${s.color}`}
                    >
                      {s.label}
                      <ChevronDown size={10} className="opacity-50" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map(key => (
                        <DropdownMenuItem
                          key={key}
                          onClick={() =>
                            updateTask(task.id, {
                              status: key,
                              completed: key === 'DONE',
                            })
                          }
                          className="flex items-center justify-between text-[11px] font-medium"
                        >
                          {STATUS_CONFIG[key].label}
                          {task.status === key && (
                            <Check size={12} className="text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div
                    className={`flex w-20 items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${p.color}`}
                  >
                    <P_Icon size={10} />
                    {p.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-border/40 bg-muted/5 p-3">
          <Link
            href="/tasks"
            className="flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            View all tasks <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      <TaskCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </>
  )
}
