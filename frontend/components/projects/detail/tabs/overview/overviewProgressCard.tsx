import { TrendingUp } from 'lucide-react'

interface OverviewProgressCardProps {
  pct: number
  total: number
  done: number
  todo: number
  inProgress: number
}

function RadialProgress({ pct }: { pct: number }) {
  const r = 48
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 120, height: 120 }}
    >
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="7"
          stroke="currentColor"
          className="text-muted/50"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{
            stroke: 'url(#rg)',
            filter: 'drop-shadow(0 0 5px oklch(0.6 0.16 262 / 0.65))',
            transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <defs>
          <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.52 0.2 262)" />
            <stop offset="100%" stopColor="oklch(0.7 0.14 262)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="text-[26px] font-bold tabular-nums leading-none"
          style={{ color: 'oklch(0.68 0.16 262)' }}
        >
          {pct}%
        </span>
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/50 mt-0.5">
          done
        </span>
      </div>
    </div>
  )
}

export default function OverviewProgressCard({
  pct,
  total,
  done,
  todo,
  inProgress,
}: OverviewProgressCardProps) {
  const healthLabel =
    pct >= 80
      ? 'On Track'
      : pct >= 40
        ? 'In Progress'
        : total === 0
          ? 'Not Started'
          : 'Early Stage'

  const healthColor =
    pct >= 80
      ? 'text-emerald-400'
      : pct >= 40
        ? 'text-amber-400'
        : 'text-muted-foreground'

  return (
    <div
      className="col-span-4 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4"
      style={{
        background:
          'linear-gradient(150deg, hsl(var(--card)) 55%, oklch(0.16 0.05 262) 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Progress</h3>
          <p className={`text-[11px] font-semibold mt-0.5 ${healthColor}`}>
            {healthLabel}
          </p>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp size={13} className="text-primary" />
        </div>
      </div>

      {/* Ring */}
      <div className="flex justify-center">
        <RadialProgress pct={pct} />
      </div>

      <p className="text-center text-[11px] text-muted-foreground/50 tabular-nums -mt-1">
        {done} of {total} tasks completed
      </p>

      {/* Mini stat row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40">
        {[
          { label: 'Todo', value: todo, color: 'text-slate-400' },
          { label: 'Active', value: inProgress, color: 'text-amber-400' },
          { label: 'Done', value: done, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center gap-0.5">
            <span className={`text-lg font-bold tabular-nums ${s.color}`}>{s.value}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
