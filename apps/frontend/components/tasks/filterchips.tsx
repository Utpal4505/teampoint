import { X } from 'lucide-react'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/features/tasks/constants'
import type { Filters } from '@/features/tasks/types'

interface FilterChipsProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export default function FilterChips({ filters, onChange }: FilterChipsProps) {
  const chips: { key: keyof Filters; val: string; label: string }[] = []

  ;(filters.status || []).forEach(s =>
    chips.push({ key: 'status', val: s, label: `Status: ${STATUS_CONFIG[s].label}` }),
  )
  ;(filters.priority || []).forEach(p =>
    chips.push({
      key: 'priority',
      val: p,
      label: `Priority: ${PRIORITY_CONFIG[p].label}`,
    }),
  )
  ;(filters.type || []).forEach(t =>
    chips.push({
      key: 'type',
      val: t,
      label: `Type: ${t.charAt(0) + t.slice(1).toLowerCase()}`,
    }),
  )

  if (!chips.length) return null

  const remove = (key: keyof Filters, val: string) => {
    onChange({ ...filters, [key]: (filters[key] as string[]).filter(v => v !== val) })
  }

  return (
    <div className="flex flex-wrap gap-2 pb-1">
      {chips.map(({ key, val, label }) => (
        <div
          key={`${key}-${val}`}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-accent/50 px-2.5 py-1 text-xs text-foreground"
        >
          {label}
          <button
            onClick={() => remove(key, val)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={10} />
          </button>
        </div>
      ))}
    </div>
  )
}
