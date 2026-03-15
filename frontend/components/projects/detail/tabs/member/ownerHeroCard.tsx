import Image from 'next/image'
import { Crown, Mail, CalendarDays } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { MemberWithStats } from './memberTab.types'

function workloadColor(pct: number) {
  if (pct >= 80) return { bar: '#34d399', glow: 'rgba(52,211,153,0.4)', text: '#34d399' }
  if (pct >= 40) return { bar: '#fbbf24', glow: 'rgba(251,191,36,0.4)', text: '#fbbf24' }
  return { bar: '#818cf8', glow: 'rgba(129,140,248,0.4)', text: '#818cf8' }
}

function joinedDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function OwnerHeroCard({ member }: { member: MemberWithStats }) {
  const pct =
    member.taskTotal > 0 ? Math.round((member.taskDone / member.taskTotal) * 100) : 0
  const color = workloadColor(pct)

  return (
    <div
      className="relative rounded-2xl border border-amber-400/20 bg-card overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, hsl(var(--card)) 60%, oklch(0.18 0.04 60) 100%)',
      }}
    >
      {/* Top glow line */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, oklch(0.72 0.18 60 / 0.8) 50%, transparent)',
        }}
      />

      <div className="flex items-center gap-6 px-6 py-5">
        {/* Avatar — larger */}
        <div className="relative shrink-0">
          {member.user.avatarUrl ? (
            <Image
              src={member.user.avatarUrl}
              alt={member.user.fullName}
              width={60}
              height={60}
              className="rounded-2xl object-cover ring-2 ring-amber-400/30"
            />
          ) : (
            <div
              className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl
              bg-amber-400/15 text-[18px] font-bold text-amber-500
              ring-2 ring-amber-400/30"
            >
              {getInitials(member.user.fullName)}
            </div>
          )}
          {/* Crown badge */}
          <div
            className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center
            justify-center rounded-full bg-amber-400 border-2 border-card
            shadow-sm shadow-amber-400/40"
          >
            <Crown size={11} className="text-background" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-[16px] font-bold text-foreground leading-tight">
              {member.user.fullName}
            </h3>
            <span
              className="inline-flex items-center gap-1 rounded-full border
              border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5
              text-[10px] font-bold uppercase tracking-wider text-amber-400"
            >
              <Crown size={9} /> Owner
            </span>
          </div>

          <div className="flex items-center gap-4 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
              <Mail size={10} /> {member.user.email}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
              <CalendarDays size={10} /> Joined {joinedDate(member.joinedAt)}
            </span>
          </div>

          {/* Workload */}
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] font-semibold text-muted-foreground/50
                uppercase tracking-wider"
              >
                Workload
              </span>
              <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                {member.taskDone}/{member.taskTotal} tasks
                <span className="ml-1.5 font-bold" style={{ color: color.bar }}>
                  · {pct}%
                </span>
              </span>
            </div>
            <div className="h-2 w-full max-w-xs rounded-full bg-muted/50 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: `linear-gradient(90deg, ${color.bar}99, ${color.bar})`,
                  boxShadow: pct > 0 ? `0 0 8px ${color.glow}` : 'none',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
