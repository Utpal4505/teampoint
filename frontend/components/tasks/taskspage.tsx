'use client'

import { useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { INITIAL_TASKS, COLUMNS } from '@/features/tasks/constants'
import type { Task, Filters, Status, ViewMode } from '@/features/tasks/types'
import FilterDropdown from './filterdropdown'
import FilterChips from './filterchips'
import KanbanColumn from './kanbancolumn'
import ListView from './listview'
import TaskDrawer from './taskdrawer'
import { TaskCreateModal, TaskCreatePayload } from './taskcreatemodal'
import { SidebarInset, SidebarTrigger } from '../ui/sidebar'
import { Separator } from '@/components/ui/separator'

const EMPTY_FILTERS: Filters = { status: [], priority: [], type: [] }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS)
  const [view, setView] = useState<ViewMode>('kanban')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [modalStatus, setModalStatus] = useState<Status>('TODO')

  const filteredTasks = tasks.filter(t => {
    if (filters.status?.length && !filters.status.includes(t.status)) return false
    if (filters.priority?.length && !filters.priority.includes(t.priority)) return false
    if (filters.type?.length && !filters.type.includes(t.type)) return false
    return true
  })

  function handleAddTask(status: Status) {
    setModalStatus(status)
    setModalOpen(true)
  }

  async function handleCreateTask(payload: TaskCreatePayload) {
    const optimistic: Task = {
      id: Date.now(),
      title: payload.title,
      description: payload.description,
      type: payload.type,
      project: payload.projectId,
      priority: payload.priority,
      status: payload.status,
      dueDate: payload.dueDate,
      assignee: 'me',
    }
    setTasks(prev => [...prev, optimistic])
  }

  return (
    <SidebarInset>
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex flex-1 items-center gap-3 px-6">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
          <div className="h-4 w-px shrink-0 bg-border" />
          <h1 className="flex-1 font-display text-lg font-bold tracking-tight text-foreground">
            Tasks
          </h1>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* View Toggle */}
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

          <FilterDropdown
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(EMPTY_FILTERS)}
          />

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground
              shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)] transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <Plus size={14} /> Add Task
          </button>
        </div>

        <FilterChips filters={filters} onChange={setFilters} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
        {view === 'kanban' ? (
          <div
            className="grid h-full gap-4"
            style={{
              gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))',
              alignItems: 'start',
            }}
          >
            {COLUMNS.map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={filteredTasks.filter(t => t.status === status)}
                onTaskClick={setSelectedTask}
                onAddTask={handleAddTask}
              />
            ))}
          </div>
        ) : (
          <ListView tasks={filteredTasks} onTaskClick={setSelectedTask} />
        )}
      </div>

      <TaskDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />

      <TaskCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </SidebarInset>
  )
}
