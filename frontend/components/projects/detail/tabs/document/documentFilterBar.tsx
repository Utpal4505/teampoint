import type { DocumentFilter } from './documentsTab.types'

const FILTERS: { key: DocumentFilter; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'LINKED', label: 'Linked' },
  { key: 'UNLINKED', label: 'Unlinked' },
  { key: 'ARCHIVED', label: 'Archived' },
]

interface DocumentFilterBarProps {
  active: DocumentFilter
  counts: Record<DocumentFilter, number>
  onChange: (filter: DocumentFilter) => void
}

export default function DocumentFilterBar({
  active,
  counts,
  onChange,
}: DocumentFilterBarProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/30 border border-border/40 w-fit">
      {FILTERS.map(f => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium
            transition-all duration-150
            ${
              active === f.key
                ? 'bg-background text-foreground shadow-sm shadow-black/10 border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          {f.label}
          <span
            className={`text-[10px] tabular-nums font-bold min-w-[16px] text-center
            ${active === f.key ? 'text-primary' : 'text-muted-foreground/50'}`}
          >
            {counts[f.key]}
          </span>
        </button>
      ))}
    </div>
  )
}
