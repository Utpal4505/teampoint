import { CheckCircle2 } from 'lucide-react'
import type { Mode } from '@/features/feedback/types'

interface SuccessStepProps {
  mode: Mode
  onClose: () => void
}

export default function SuccessStep({ mode, onClose }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      {/* Icon */}
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-muted/40">
          <CheckCircle2 size={28} className="text-foreground" />
        </div>
        {/* subtle glow ring */}
        <div className="absolute inset-0 rounded-2xl ring-4 ring-ring/10" />
      </div>

      <div className="space-y-1.5">
        <p className="text-base font-semibold text-foreground">
          {mode === 'bug' ? 'Bug report submitted' : 'Feedback received'}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[260px]">
          {mode === 'bug'
            ? "We've logged the issue. A GitHub issue will be created and you'll be notified of updates."
            : 'Thanks for taking the time. We read every response carefully.'}
        </p>
      </div>

      <button
        onClick={onClose}
        className="rounded-xl border border-border bg-muted/30 px-6 py-2
          text-xs font-semibold text-muted-foreground
          hover:bg-muted/60 hover:text-foreground
          transition-all duration-150"
      >
        Close
      </button>
    </div>
  )
}
