'use client'

import { useState } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  projectName: string
  onConfirm?: () => Promise<void>
}

export default function DeleteConfirmModal({
  open,
  onClose,
  projectName,
  onConfirm,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onConfirm?.()
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
        className="w-full max-w-[380px] rounded-2xl border border-border bg-card
        shadow-[0_32px_80px_oklch(0_0_0/0.7)]
        animate-in fade-in-0 zoom-in-95 duration-200"
      >
        <div
          className="h-[2px] w-full rounded-t-2xl"
          style={{
            background:
              'linear-gradient(90deg,transparent 10%,oklch(0.62 0.2 25/0.7) 50%,transparent 90%)',
          }}
        />

        <div className="flex flex-col items-center gap-4 px-6 pt-6 pb-5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
            <AlertTriangle size={20} className="text-destructive" />
          </div>

          <div>
            <h2 className="font-display text-[15px] font-bold text-foreground">
              Delete project?
            </h2>
            <p className="mt-1.5 text-[13px] text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">{projectName}</span> and all
              its tasks, documents, and data will be permanently removed.
            </p>
            <p className="mt-2 text-[11px] text-destructive/70 font-medium">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5
              text-sm text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl
              bg-destructive px-4 py-2.5 text-sm font-medium text-white
              shadow-[0_2px_12px_oklch(0.62_0.2_25/0.3)] transition-all
              hover:opacity-90 hover:-translate-y-px disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 size={14} /> Delete Project
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
