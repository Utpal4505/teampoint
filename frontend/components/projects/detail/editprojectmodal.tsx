'use client'

import { useState } from 'react'
import { X, FolderKanban, Loader2 } from 'lucide-react'
import type { ProjectDetail, ProjectStatus } from '@/features/projects/detail/types'
import { STATUS_CONFIG } from '@/features/projects/constants'

interface EditProjectModalProps {
  open: boolean
  onClose: () => void
  project: ProjectDetail
  onSubmit?: (data: {
    name: string
    description: string
    status: ProjectStatus
  }) => Promise<void>
}

const STATUS_OPTIONS: ProjectStatus[] = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'DELETED']

export default function EditProjectModal({
  open,
  onClose,
  project,
  onSubmit,
}: EditProjectModalProps) {
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description ?? '')
  const [status, setStatus] = useState<ProjectStatus>(project.status)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!name.trim()) return
    setLoading(true)
    await onSubmit?.({ name: name.trim(), description: description.trim(), status })
    setLoading(false)
    onClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.7)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl border border-border bg-card
        shadow-[0_32px_80px_oklch(0_0_0/0.7)]
        animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Shimmer */}
        <div
          className="h-[2px] w-full rounded-t-2xl"
          style={{
            background:
              'linear-gradient(90deg,transparent 10%,oklch(0.6 0.16 262/0.7) 50%,transparent 90%)',
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <FolderKanban size={16} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display text-[15px] font-bold text-foreground">
                Edit Project
              </h2>
              <p className="text-[11px] text-muted-foreground">Update project details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg
              text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <X size={15} />
          </button>
        </div>

        <div className="h-px mx-6 bg-border" />

        {/* Fields */}
        <div className="flex flex-col gap-4 px-6 py-5">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Project name <span className="text-destructive">*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={150}
              className="w-full rounded-xl border border-border bg-background px-4 py-3
                text-sm text-foreground placeholder:text-muted-foreground/35 outline-none
                transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-xl border border-border bg-background
                px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/35
                outline-none transition-all focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => {
                const cfg = STATUS_CONFIG[s]
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5
                      text-xs font-medium transition-all
                      ${status === s ? `${cfg.color} ${cfg.bg} ${cfg.border}` : 'border-border text-muted-foreground hover:bg-accent'}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2.5 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5
              text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary
              px-4 py-2.5 text-sm font-medium text-primary-foreground
              shadow-[0_2px_12px_oklch(0.6_0.16_262/0.3)] transition-all
              hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Saving…
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
