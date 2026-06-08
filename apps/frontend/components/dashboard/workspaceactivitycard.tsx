import { Zap } from 'lucide-react'

export function WorkspaceActivityCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 pt-5 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[oklch(0.52_0.15_145/0.1)]">
          <Zap size={13} className="text-[oklch(0.58_0.14_145)]" />
        </div>
        <h2 className="font-display text-sm font-bold text-foreground">
          Workspace Activity
        </h2>
      </div>
      {/* Coming Soon State */}
      <div className="flex flex-1 flex-col justify-between px-5 pb-5 pt-2">
        {/* Top content */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-semibold px-2 py-[2px] rounded-full 
        bg-[oklch(0.7_0.15_55/0.12)] text-[oklch(0.7_0.15_55)]"
            >
              Coming Soon
            </span>
          </div>

          <p className="text-sm font-medium text-foreground leading-snug">
            Real-time team updates
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
            Stay in sync with your team — see tasks, comments, and progress as they
            happen.
          </p>
        </div>

        {/* Bottom subtle hint */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/60">Beta or v1</span>

          <span className="text-[10px] text-muted-foreground/40">⚡Live soon</span>
        </div>
      </div>{' '}
    </div>
  )
}
