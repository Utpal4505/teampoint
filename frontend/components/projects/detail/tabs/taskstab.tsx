'use client'

import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { COLUMNS } from '@/features/tasks/constants'
import type { ViewMode, Status, Task, Filters } from '@/features/tasks/types'
import type { ProjectTask, TaskStatus } from '@/features/projects/detail/types'
import FilterDropdown from '@/components/tasks/filterdropdown'
import FilterChips from '@/components/tasks/filterchips'
import KanbanColumn from '@/components/tasks/kanbancolumn'
import ListView from '@/components/tasks/listview'
import TaskDrawer from '@/components/tasks/taskdrawer'

const EMPTY_FILTERS: Filters = { status: [], priority: [], type: [] }

function toTask(t: ProjectTask): Task {
  return {
    ...t,
    status: t.status as Status,
    priority: t.priority as Task['priority'],
    description: '',
    type: 'PROJECT',
    assignee: t.assignedTo?.name ?? 'Unassigned',
    avatarUrl: t.assignedTo?.avatarUrl,
    project: null,
  }
}

interface TasksTabProps {
  projectId: number
  tasks: ProjectTask[]
  isLoading: boolean
  onStatusChange: (taskId: number, status: TaskStatus) => void
}

export default function TasksTab({ tasks, isLoading, onStatusChange }: TasksTabProps) {
  const [view, setView] = useState<ViewMode>('kanban')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  const uiTasks: Task[] = tasks.map(toTask)

  const filtered = uiTasks.filter(t => {
    if (filters.status?.length && !filters.status.includes(t.status)) return false
    if (filters.priority?.length && !filters.priority.includes(t.priority)) return false
    return true
  })

  const selectedTask = selectedTaskId ? uiTasks.find(t => t.id === selectedTaskId) ?? null : null

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-0.5 rounded-xl border border-border bg-muted/40 p-1">
            {(['kanban', 'list'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                  ${view === v ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {v === 'kanban' ? <LayoutGrid size={13} /> : <List size={13} />}
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <FilterDropdown filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />
        </div>
        <FilterChips filters={filters} onChange={setFilters} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : view === 'kanban' ? (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))', alignItems: 'start' }}
          >
            {COLUMNS.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={filtered.filter(t => t.status === status)}
                onTaskClick={t => setSelectedTaskId(t.id)}
                onAddTask={() => {}}
                onDropTask={(taskId, newStatus) =>
                  onStatusChange(taskId, newStatus as TaskStatus)
                }
              />
            ))}
          </div>
        ) : (
          <ListView
            tasks={filtered}
            onTaskClick={t => setSelectedTaskId(t.id)}
            onStatusChange={(taskId, newStatus) =>
              onStatusChange(taskId, newStatus as TaskStatus)
            }
          />
        )}
      </div>

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onStatusChange={(taskId, newStatus) =>
          onStatusChange(taskId, newStatus as TaskStatus)
        }
      />
    </div>
  )
}