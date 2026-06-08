'use client'

import { ComponentType } from 'react'

interface AuthButtonProps {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  onClick?: () => void
  disabled?: boolean
}

export function AuthButton({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: AuthButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        group flex w-full items-center gap-2 rounded-xl
        border border-border
        bg-card
        px-6 py-4
        text-foreground
        font-body text-sm
        transition-all duration-150 ease-out
        hover:border-primary/40
        hover:bg-muted
        hover:-translate-y-px
        hover:shadow-[0_4px_20px_oklch(0_0_0/0.3)]
        active:translate-y-0 active:scale-[0.99]
        disabled:cursor-not-allowed disabled:opacity-40
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-card
      "
    >
      <Icon
        size={18}
        className="shrink-0 text-muted-foreground transition-colors duration-150 group-hover:text-foreground"
      />
      <span className="flex-1 text-center">{label}</span>
    </button>
  )
}
