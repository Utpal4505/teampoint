'use client'

import { useState } from 'react'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { COLUMNS } from '@/features/tasks/constants'
import type {
  AssignedTask,
  Filters,
  Status,
  Task,
  ViewMode,
} from '@/features/tasks/types'
import FilterDropdown from './filterdropdown'
import FilterChips from './filterchips'
import KanbanColumn from './kanbancolumn'
import ListView from './listview'
import TaskDrawer from './taskdrawer'
import { TaskCreateModal, TaskCreatePayload } from './taskcreatemodal'
import { SidebarInset, SidebarTrigger } from '../ui/sidebar'
import {
  useWorkspaceAssignedTasks,
  useUpdateTaskStatus,
  useCreateTask,
} from '@/features/tasks/hooks'
import { useWorkspaceId } from '@/hooks/useworkspaceid'
import { useUserStore } from '@/store/user.store'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { handleApiError } from '@/lib/handle-api-error'

const EMPTY_FILTERS: Filters = { status: [], priority: [], type: [] }

function toTask(t: AssignedTask): Task {
  return {
    ...t,
    description: t.description ?? '',
    type: t.taskType,
    assignee: t.assignedTo?.name ?? 'Unassigned',
    avatarUrl: t.assignedTo?.avatarUrl ?? undefined,
  }
}

export default function TasksPage() {
  const workspaceId = useWorkspaceId()
  const queryClient = useQueryClient()
  const { user } = useUserStore()

  const { data: rawTasks = [], isLoading } = useWorkspaceAssignedTasks(workspaceId)
  const { mutate: updateStatus } = useUpdateTaskStatus(workspaceId)
  const { mutate: createTaskMutate } = useCreateTask(workspaceId)

  const tasks: Task[] = rawTasks.map(toTask)

  const [view, setView] = useState<ViewMode>('kanban')
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filteredTasks = tasks.filter(t => {
    if (filters.status?.length && !filters.status.includes(t.status)) return false
    if (filters.priority?.length && !filters.priority.includes(t.priority)) return false
    if (filters.type?.length && !filters.type.includes(t.type)) return false
    return true
  })

  const selectedTask = selectedTaskId
    ? (tasks.find(t => t.id === selectedTaskId) ?? null)
    : null

  function handleAddTask() {
    setModalOpen(true)
  }

  async function handleDropTask(taskId: number, newStatus: Status) {
    const raw = rawTasks.find(t => t.id === taskId)
    const projectId = raw?.project?.id
    if (!projectId) {
      toast.error('Project association not found')
      return
    }
    updateStatus({ projectId, taskId, status: newStatus })
  }

  async function handleCreateTask(payload: TaskCreatePayload) {
    try {
      if (!user) {
        toast.error('User not found please login again')
        return
      }

      if (payload.type === 'PROJECT' && payload.projectId) {
        createTaskMutate({
          taskType: payload.type,
          projectId: parseInt(payload.projectId),
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
          assignedTo: user.id,
        })
      } else {
        createTaskMutate({
          taskType: 'PERSONAL',
          title: payload.title,
          description: payload.description,
          priority: payload.priority,
          dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
          assignedTo: user.id,
        })
      }
      setModalOpen(false)
      toast.success('Task created successfully!')
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })
    } catch (error) {
      handleApiError(error)
    }
  }

  return (
    <SidebarInset>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex flex-1 items-center gap-3 px-6">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
          <div className="h-4 w-px shrink-0 bg-border" />
          <h1 className="flex-1 font-display text-lg font-bold tracking-tight text-foreground">
            Tasks
          </h1>
        </div>
      </header>

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

      <div className="flex-1 overflow-hidden p-6">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : view === 'kanban' ? (
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
                onTaskClick={t => setSelectedTaskId(t.id)}
                onAddTask={handleAddTask}
                onDropTask={handleDropTask}
              />
            ))}
          </div>
        ) : (
          <ListView
            tasks={filteredTasks}
            onTaskClick={t => setSelectedTaskId(t.id)}
            onStatusChange={handleDropTask}
          />
        )}
      </div>

      <TaskDrawer
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onStatusChange={handleDropTask}
      />

      <TaskCreateModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </SidebarInset>
  )
}
