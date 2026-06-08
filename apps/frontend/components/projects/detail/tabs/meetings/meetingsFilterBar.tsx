import type { MeetingFilter } from './meetings.types'

const FILTERS: { key: MeetingFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'SCHEDULED', label: 'Scheduled' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

interface MeetingsFilterBarProps {
  active: MeetingFilter
  counts: Record<MeetingFilter, number>
  onChange: (f: MeetingFilter) => void
}

export default function MeetingsFilterBar({
  active,
  counts,
  onChange,
}: MeetingsFilterBarProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border/40 w-fit">
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium
            transition-colors duration-100
            ${
              active === f.key
                ? 'bg-background text-foreground shadow-sm shadow-black/10 border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          {f.label}
          <span
            className={`text-[10px] font-bold tabular-nums min-w-[14px] text-center
            ${active === f.key ? 'text-primary' : 'text-muted-foreground/50'}`}
          >
            {counts[f.key]}
          </span>
        </button>
      ))}
    </div>
  )
}
