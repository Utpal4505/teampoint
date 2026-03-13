import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

interface AuthCardProps {
  children: ReactNode
  showBack?: boolean
  onBack?: () => void
}

export function AuthCard({ children, showBack, onBack }: AuthCardProps) {
  return (
    <div
      className="
      relative w-full max-w-sm overflow-hidden rounded-2xl
      border border-border
      bg-card
      p-8
      shadow-lg
      "
    >
      <div
        className="
        pointer-events-none absolute inset-x-0 top-0 h-px
        bg-linear-to-r from-transparent via-primary/50 to-transparent
        "
      />

      {showBack && onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-1.5
            text-xs font-medium text-muted-foreground
            hover:text-foreground transition-colors duration-150"
        >
          <ArrowLeft size={13} />
          Back
        </button>
      )}

      {children}
    </div>
  )
}
