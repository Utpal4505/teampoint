import { ChevronRight } from 'lucide-react'

interface SettingsRowProps {
  title: string
  description?: string
  value?: React.ReactNode
  onClick?: () => void
  danger?: boolean
  disabled?: boolean
}

export default function SettingsRow({
  title,
  description,
  value,
  onClick,
  danger,
  disabled,
}: SettingsRowProps) {
  const isClickable = !!onClick && !disabled

  return (
    <button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={`group w-full flex items-center justify-between gap-6
        py-4 border-b border-border/50 last:border-0 text-left
        transition-colors duration-100
        ${isClickable ? 'cursor-pointer hover:bg-accent/20 -mx-5 px-5' : 'cursor-default'}
        ${danger && isClickable ? 'hover:bg-red-500/5' : ''}
      `}
    >
      {/* Left: title + description */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className={`text-[13px] font-medium leading-snug
          ${danger ? 'text-red-400' : 'text-foreground'}`}
        >
          {title}
        </span>
        {description && (
          <span className="text-[12px] text-muted-foreground/50 leading-relaxed">
            {description}
          </span>
        )}
      </div>

      {/* Right: value + arrow */}
      <div className="flex items-center gap-2 shrink-0">
        {value && <span className="text-[13px] text-muted-foreground/60">{value}</span>}
        {isClickable && (
          <ChevronRight
            size={14}
            className={`transition-all duration-100 shrink-0
              ${
                danger
                  ? 'text-red-400/30 group-hover:text-red-400'
                  : 'text-muted-foreground/25 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5'
              }`}
          />
        )}
      </div>
    </button>
  )
}
