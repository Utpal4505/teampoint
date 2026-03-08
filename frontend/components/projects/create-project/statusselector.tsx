import { STATUS_OPTIONS } from '@/features/projects/create-project/constants'
import { ProjectStatus } from '@/features/projects/create-project/schemas'
import { Check } from 'lucide-react'

export function StatusSelector({
  value,
  onChange,
}: {
  value: ProjectStatus
  onChange: (s: ProjectStatus) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {STATUS_OPTIONS.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3
            text-left transition-all duration-150
            ${
              value === opt.value
                ? 'border-primary/40 bg-primary/8 shadow-[0_0_0_1px_oklch(0.6_0.16_262/0.15)]'
                : 'border-border bg-background hover:bg-accent'
            }`}
        >
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${opt.dot}
            ${value === opt.value ? 'shadow-[0_0_6px_currentColor]' : ''}`}
          />
          <div className="flex-1">
            <p
              className={`font-sans text-sm font-medium transition-colors
              ${value === opt.value ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {opt.label}
            </p>
            <p className="font-sans text-[10px] text-muted-foreground/60">{opt.desc}</p>
          </div>
          {value === opt.value && <Check size={13} className="shrink-0 text-primary" />}
        </button>
      ))}
    </div>
  )
}
