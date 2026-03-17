'use client'

import { STATUS_CONFIG } from '@/features/projects/constants'
import { ProjectStatus, ViewMode } from '@/features/projects/types'
import { LayoutGrid, List, ChevronDown, Plus } from 'lucide-react'

type StatusFilter = 'ALL' | ProjectStatus

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'All Status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'ONHOLD', label: 'On Hold' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'DELETED', label: 'Archived' },
]

interface ProjectsToolbarProps {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
  statusFilter: StatusFilter
  onStatusChange: (v: StatusFilter) => void
  statusOpen: boolean
  onStatusToggle: () => void
  onNewProject: () => void
}

export type { StatusFilter }
export { STATUS_FILTERS }

export default function ProjectsToolbar({
  view,
  onViewChange,
  statusFilter,
  onStatusChange,
  statusOpen,
  onStatusToggle,
  onNewProject,
}: ProjectsToolbarProps) {
  const activeLabel = STATUS_FILTERS.find(f => f.value === statusFilter)!.label

  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-3 flex-wrap">
      {/* View toggle */}
      <div className="flex items-center gap-0.5 rounded-xl border border-border bg-muted/40 p-1">
        {(['card', 'list'] as ViewMode[]).map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all
              ${
                view === v
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {v === 'card' ? <LayoutGrid size={13} /> : <List size={13} />}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="relative">
        <button
          onClick={onStatusToggle}
          className="flex items-center gap-2 rounded-xl border border-border bg-background
            px-3.5 py-2 text-xs font-medium text-foreground transition-all
            hover:border-border/80 hover:bg-accent/50"
        >
          {statusFilter !== 'ALL' && (
            <span
              className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[statusFilter as ProjectStatus].dot}`}
            />
          )}
          {activeLabel}
          <ChevronDown
            size={12}
            className={`text-muted-foreground transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {statusOpen && (
          <div
            className="absolute left-0 top-[calc(100%+6px)] z-20 min-w-[150px]
            overflow-hidden rounded-xl border border-border bg-card
            shadow-[0_8px_32px_oklch(0_0_0/0.4)]"
          >
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => onStatusChange(f.value)}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs
                  font-medium transition-colors hover:bg-accent/50
                  ${statusFilter === f.value ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {f.value !== 'ALL' && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${STATUS_CONFIG[f.value as ProjectStatus].dot}`}
                  />
                )}
                {f.label}
                {statusFilter === f.value && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* New project */}
      <button
        onClick={onNewProject}
        className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm
          font-medium text-primary-foreground
          shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)]
          transition-all hover:opacity-90 hover:-translate-y-px active:scale-[0.98]"
      >
        <Plus size={14} /> New Project
      </button>
    </div>
  )
}
