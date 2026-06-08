import { X, PartyPopper } from 'lucide-react'

interface ModalHeaderProps {
  workspaceName: string
  initials:      string
  gradient:      string
  onClose:       () => void
}

export function ModalHeader({ workspaceName, initials, gradient, onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-start justify-between px-6 pt-6 pb-5">
      <div className="flex items-center gap-4">
        {/* Workspace avatar — same style as CreateWorkspaceModal */}
        <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center
          rounded-2xl bg-gradient-to-br ${gradient}
          shadow-[0_4px_16px_oklch(0_0_0/0.3)]`}>
          <span className="font-display text-base font-bold text-white tracking-wide">
            {initials}
          </span>
          <div className="absolute inset-0 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, oklch(1 0 0 / 0.15) 0%, transparent 60%)' }} />
          {/* Party badge */}
          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center
            rounded-full bg-[oklch(0.52_0.15_145)] shadow-[0_2px_6px_oklch(0_0_0/0.3)]">
            <PartyPopper size={10} className="text-white" />
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-base font-bold text-foreground leading-tight">
              Workspace created!
            </h2>
            <span className="text-base">🎉</span>
          </div>
          <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
            <span className="font-semibold text-foreground/80">{workspaceName}</span> is ready to go
          </p>
        </div>
      </div>

      <button onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg
          border border-transparent text-muted-foreground transition-all duration-150
          hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <X size={15} strokeWidth={2} />
      </button>
    </div>
  )
}