'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { COLUMN_STYLES } from '@/features/tasks/constants'
import TaskCard from './taskcard'
import type { Task, Status } from '@/features/tasks/types'

interface KanbanColumnProps {
  status: Status
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: Status) => void
  onDropTask: (taskId: number, newStatus: Status) => void
}

export default function KanbanColumn({
  status,
  tasks,
  onTaskClick,
  onAddTask,
  onDropTask,
}: KanbanColumnProps) {
  const cfg = COLUMN_STYLES[status]
  const [dragOver, setDragOver] = useState(false)
  const [draggingId, setDraggingId] = useState<number | null>(null)

  function handleDragStart(e: React.DragEvent, task: Task) {
    setDraggingId(task.id)
    e.dataTransfer.setData('taskId', String(task.id))
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(true)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const raw = e.dataTransfer.getData('taskId')
    if (raw) onDropTask(+raw, status)
    setDragOver(false)
    setDraggingId(null)
  }

  return (
    <div
      className={`flex flex-col rounded-2xl border transition-all duration-200 ${cfg.border}`}
      style={{
        background: `linear-gradient(180deg, ${cfg.glow} 0%, transparent 35%)`,
        minHeight: 480,
      }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/40">
        <span className={`text-xs font-bold uppercase tracking-widest ${cfg.accent}`}>
          {cfg.label}
        </span>
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-semibold text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      {/* Inner dashed drop zone */}
      <div
        className={`m-3 flex flex-col gap-2.5 overflow-y-auto rounded-xl border border-dashed p-2.5 transition-all duration-200
          ${dragOver ? `${cfg.border} brightness-140` : 'border-border'}`}
        style={{ flex: 1 }}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            dragging={draggingId === task.id}
            onDragStart={handleDragStart}
          />
        ))}
      </div>

      {/* Add Task */}
      <div className="px-3 pb-3">
        <button
          onClick={() => onAddTask(status)}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border/40
            px-3 py-2.5 text-xs text-muted-foreground/40 transition-all
            hover:border-border/70 hover:text-muted-foreground hover:bg-accent/20"
        >
          <Plus size={13} /> Add Task
        </button>
      </div>
    </div>
  )
}
