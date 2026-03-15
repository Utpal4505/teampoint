import Image from 'next/image'
import { getInitials } from '@/lib/utils'
import type { ProjectMember } from '@/features/projects/detail/types'
import type { TabKey } from '../../projectdetailpage'

export interface MemberWorkload {
  member: ProjectMember
  total: number
  done: number
}

interface OverviewTeamWorkloadProps {
  workload: MemberWorkload[]
  onTabChange: (tab: TabKey) => void
}

export default function OverviewTeamWorkload({
  workload,
  onTabChange,
}: OverviewTeamWorkloadProps) {
  return (
    <div className="col-span-7 rounded-2xl border border-border/60 bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground">Team Workload</h3>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5">
            Tasks assigned per member
          </p>
        </div>
        <button
          onClick={() => onTabChange('members')}
          className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          Manage →
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {workload.map(({ member: m, total, done }) => {
          const completionPct = total > 0 ? Math.round((done / total) * 100) : 0

          return (
            <div key={m.user.id} className="flex items-center gap-3">
              {/* Avatar */}
              {m.user.avatarUrl ? (
                <Image
                  src={m.user.avatarUrl}
                  alt={m.user.fullName}
                  width={28}
                  height={28}
                  className="rounded-full ring-1 ring-border/50 shrink-0"
                />
              ) : (
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center
                  rounded-full bg-primary/20 text-[10px] font-bold text-primary"
                >
                  {getInitials(m.user.fullName)}
                </div>
              )}

              {/* Name + bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] font-medium text-foreground truncate">
                    {m.user.fullName}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 tabular-nums shrink-0 ml-2">
                    {done}/{total}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${completionPct}%`,
                      background:
                        'linear-gradient(90deg, oklch(0.52 0.2 262), oklch(0.68 0.14 262))',
                    }}
                  />
                </div>
              </div>

              {/* Role badge */}
              <span
                className={`text-[9px] font-bold uppercase tracking-wider
                  px-1.5 py-0.5 rounded-full shrink-0
                  ${
                    m.role === 'OWNER'
                      ? 'bg-primary/15 text-primary'
                      : m.role === 'ADMIN'
                        ? 'bg-amber-400/15 text-amber-500'
                        : 'bg-muted text-muted-foreground/50'
                  }`}
              >
                {m.role}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
