import type { TabKey } from '../../projectdetailpage'
import { PRIORITY_META, type PriorityKey } from './constants'

interface PriorityCount {
  key: PriorityKey
  count: number
}

interface OverviewPriorityCardProps {
  byPriority: PriorityCount[]
  activeTotal: number
  cancelled: number
  onTabChange: (tab: TabKey) => void
}

export default function OverviewPriorityCard({
  byPriority,
  activeTotal,
  cancelled,
  onTabChange,
}: OverviewPriorityCardProps) {
  return (
    <div className="col-span-4 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">By Priority</h3>
        <button
          onClick={() => onTabChange('tasks')}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          All tasks →
        </button>
      </div>

      {/* Segmented stacked bar */}
      {activeTotal > 0 && (
        <div className="flex h-2 w-full overflow-hidden rounded-full gap-0.5">
          {byPriority
            .filter(p => p.count > 0)
            .map(p => {
              const meta = PRIORITY_META[p.key]
              return (
                <div
                  key={p.key}
                  className={`h-full rounded-full transition-all duration-700 ${meta.color}`}
                  style={{ width: `${(p.count / activeTotal) * 100}%` }}
                  title={`${meta.label}: ${p.count}`}
                />
              )
            })}
        </div>
      )}

      {/* Per-priority rows */}
      <div className="flex flex-col gap-2.5 flex-1">
        {byPriority.map(p => {
          const meta = PRIORITY_META[p.key]
          const PIcon = meta.icon
          const barPct = activeTotal > 0 ? Math.round((p.count / activeTotal) * 100) : 0

          return (
            <div key={p.key} className="flex items-center gap-3">
              <PIcon size={12} className={`shrink-0 ${meta.text}`} />
              <span className="text-[11px] text-muted-foreground/70 w-14 shrink-0">
                {meta.label}
              </span>
              <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 opacity-70 ${meta.color}`}
                  style={{ width: `${barPct}%` }}
                />
              </div>
              <span
                className={`text-[11px] font-semibold tabular-nums w-5 text-right ${meta.text}`}
              >
                {p.count}
              </span>
            </div>
          )
        })}
      </div>

      {cancelled > 0 && (
        <p className="text-[10px] text-muted-foreground/40 border-t border-border/40 pt-2">
          {cancelled} task{cancelled !== 1 ? 's' : ''} cancelled
        </p>
      )}
    </div>
  )
}
