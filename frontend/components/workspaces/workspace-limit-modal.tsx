'use client'

import { AlertCircle, X } from 'lucide-react'

interface WorkspaceLimitModalProps {
  open: boolean
  onClose: () => void
  onManageWorkspaces: () => void
}

export function WorkspaceLimitModal({
  open,
  onClose,
  onManageWorkspaces,
}: WorkspaceLimitModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.75)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-105 rounded-2xl border border-border bg-card
        shadow-[0_32px_80px_oklch(0_0_0/0.6)]
        animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Top shimmer */}
        <div className="overflow-hidden rounded-t-2xl">
          <div
            className="h-0.5 w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 5%, oklch(0.62 0.2 25 / 0.8) 50%, transparent 95%)',
            }}
          />
        </div>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5">
          <div className="flex items-center gap-4">
            {/* Warning icon */}
            <div
              className="relative flex h-12 w-12 shrink-0 items-center justify-center
              rounded-2xl bg-linear-to-br from-[oklch(0.62_0.2_25)] to-[oklch(0.52_0.22_30)]
              shadow-[0_4px_16px_oklch(0.62_0.2_25/0.3)]"
            >
              <AlertCircle size={24} className="text-white" />
              {/* Shine overlay */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, oklch(1 0 0 / 0.15) 0%, transparent 60%)',
                }}
              />
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground leading-tight">
                Workspace limit reached
              </h2>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                Early Access plan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg
              border border-transparent text-muted-foreground transition-all duration-150
              hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="h-px mx-6 bg-border" />

        {/* ── Body ── */}
        <div className="flex flex-col gap-5 px-6 py-6">
          <div className="space-y-3">
            <p className="font-sans text-sm text-foreground leading-relaxed">
              You can create up to <span className="font-semibold">3 workspaces</span> on
              Early Access.
            </p>

            <div className="rounded-lg bg-muted/50 border border-border/60 px-4 py-3 space-y-2">
              <p className="font-sans text-xs font-semibold text-foreground">
                To create a new one:
              </p>
              <ul className="font-sans text-xs text-muted-foreground space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-primary/60 font-bold mt-0.5">•</span>
                  <span>Leave an existing workspace</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary/60 font-bold mt-0.5">•</span>
                  <span>Or delete one</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-background px-5 py-2.5
              font-sans text-sm font-medium text-muted-foreground
              transition-all duration-150 hover:bg-accent hover:text-foreground
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <button
            onClick={onManageWorkspaces}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl
              bg-primary px-5 py-2.5 font-sans text-sm font-bold text-primary-foreground
              shadow-[0_2px_16px_oklch(0.6_0.16_262/0.35)] transition-all duration-200
              hover:-translate-y-px hover:shadow-[0_6px_24px_oklch(0.6_0.16_262/0.5)]
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Manage Workspaces
          </button>
        </div>
      </div>
    </div>
  )
}
