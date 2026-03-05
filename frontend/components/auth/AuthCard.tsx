import { ReactNode } from 'react'

interface AuthCardProps {
  children: ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
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

      {children}
    </div>
  )
}
