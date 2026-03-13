import { Bug, MessageSquare, ArrowRight } from 'lucide-react'
import type { Mode } from '@/features/feedback/types'

interface SelectStepProps {
  onSelect: (mode: Mode) => void
}
 
export default function SelectStep({ onSelect }: SelectStepProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Bug card */}
      <button
        onClick={() => onSelect('bug')}
        className="group relative flex items-center gap-4 rounded-2xl border border-border
          bg-muted/40 px-5 py-4 text-left overflow-hidden
          hover:border-destructive/50 hover:bg-destructive/5
          transition-all duration-200"
      >
        {/* left accent bar */}
        <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
 
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background group-hover:border-destructive/30 group-hover:bg-destructive/10 transition-all duration-200">
          <Bug size={17} className="text-muted-foreground group-hover:text-destructive transition-colors duration-200" />
        </div>
 
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Report a Bug</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Something broken or behaving unexpectedly?
          </p>
        </div>
 
        <ArrowRight size={14} className="shrink-0 text-muted-foreground/30 group-hover:text-destructive group-hover:translate-x-0.5 transition-all duration-200" />
      </button>
 
      {/* Feedback card */}
      <button
        onClick={() => onSelect('feedback')}
        className="group relative flex items-center gap-4 rounded-2xl border border-border
          bg-muted/40 px-5 py-4 text-left overflow-hidden
          hover:border-primary/50 hover:bg-primary/5
          transition-all duration-200"
      >
        <span className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
 
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background group-hover:border-primary/30 group-hover:bg-primary/10 transition-all duration-200">
          <MessageSquare size={17} className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
        </div>
 
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Share Feedback</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Ideas, suggestions, or general thoughts.
          </p>
        </div>
 
        <ArrowRight size={14} className="shrink-0 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
      </button>
    </div>
  )
}
 