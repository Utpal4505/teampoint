import {
  LayoutGrid,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CalendarClock,
} from 'lucide-react'

interface OverviewKpiStripProps {
  total: number
  done: number
  inProgress: number
  pct: number
  overdueCount: number
  dueSoonCount: number
}

function KpiCard({
  label,
  value,
  sub,
  Icon,
  color,
  bg,
  border,
}: {
  label: string
  value: string | number
  sub?: string
  Icon: React.ElementType
  color: string
  bg: string
  border: string
}) {
  return (
    <div
      className={`flex items-center gap-3.5 rounded-2xl border ${border} ${bg} px-4 py-3.5`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} border ${border}`}
      >
        <Icon size={15} className={color} />
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-bold tabular-nums leading-none ${color}`}>{value}</p>
        <p className="text-[10px] text-muted-foreground/60 mt-0.5 uppercase tracking-wider">
          {label}
        </p>
        {sub && <p className="text-[10px] text-muted-foreground/40 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function OverviewKpiStrip({
  total,
  done,
  inProgress,
  pct,
  overdueCount,
  dueSoonCount,
}: OverviewKpiStripProps) {
  return (
    <div className="grid grid-cols-5 gap-3">
      <KpiCard
        label="Total Tasks"
        value={total}
        Icon={LayoutGrid}
        color="text-primary"
        bg="bg-primary/5"
        border="border-primary/20"
      />
      <KpiCard
        label="Completed"
        value={done}
        sub={`${pct}% of total`}
        Icon={CheckCircle2}
        color="text-emerald-400"
        bg="bg-emerald-400/5"
        border="border-emerald-400/20"
      />
      <KpiCard
        label="In Progress"
        value={inProgress}
        Icon={Clock}
        color="text-amber-400"
        bg="bg-amber-400/5"
        border="border-amber-400/20"
      />
      <KpiCard
        label="Overdue"
        value={overdueCount}
        Icon={AlertTriangle}
        color={overdueCount > 0 ? 'text-red-400' : 'text-muted-foreground'}
        bg={overdueCount > 0 ? 'bg-red-400/5' : 'bg-muted/20'}
        border={overdueCount > 0 ? 'border-red-400/20' : 'border-border/40'}
      />
      <KpiCard
        label="Due Soon"
        value={dueSoonCount}
        sub="next 7 days"
        Icon={CalendarClock}
        color="text-sky-400"
        bg="bg-sky-400/5"
        border="border-sky-400/20"
      />
    </div>
  )
}
