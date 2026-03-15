import { AlertTriangle } from 'lucide-react'
import type { ProjectTask } from '@/features/projects/detail/types'

interface OverviewAttentionCardProps {
  overdue: ProjectTask[]
  dueSoon: ProjectTask[]
}

export default function OverviewAttentionCard({
  overdue,
  dueSoon,
}: OverviewAttentionCardProps) {
  if (overdue.length === 0 && dueSoon.length === 0) return null

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <AlertTriangle size={13} className="text-red-400 shrink-0" />
        <h3 className="text-[12px] font-bold text-red-400">Needs Attention</h3>
      </div>

      <div className="flex flex-col gap-1.5">
        {overdue.slice(0, 3).map(t => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-2.5 py-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
            <span className="text-[11px] text-foreground/80 truncate flex-1">{t.title}</span>
            <span className="text-[10px] text-red-400 font-semibold shrink-0">Overdue</span>
          </div>
        ))}

        {dueSoon.slice(0, 2).map(t => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-lg bg-amber-400/10 px-2.5 py-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
            <span className="text-[11px] text-foreground/80 truncate flex-1">{t.title}</span>
            <span className="text-[10px] text-amber-400 font-semibold shrink-0">Due soon</span>
          </div>
        ))}
      </div>
    </div>
  )
}