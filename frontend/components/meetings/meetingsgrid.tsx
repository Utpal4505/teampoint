'use client'

import { Clock, Users, Video, CheckCircle2, Ban, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { MeetingListItem } from '@/features/meetings/types'
import { useWorkspaceId } from '@/hooks/useworkspaceid'

interface MeetingsGridProps {
  meetings: MeetingListItem[]
}

const STATUS_CONFIG = {
  SCHEDULED: {
    label: 'Scheduled',
    dotColor: 'bg-emerald-400',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10',
    badgeBorder: 'border-emerald-400/20',
    buttonColor: 'bg-emerald-500/90 hover:bg-emerald-500',
  },
  COMPLETED: {
    label: 'Completed',
    dotColor: 'bg-primary',
    textColor: 'text-primary',
    badgeBg: 'bg-primary/10',
    badgeBorder: 'border-primary/20',
    buttonColor: 'bg-primary/20 hover:bg-primary/30',
  },
  CANCELLED: {
    label: 'Cancelled',
    dotColor: 'bg-muted-foreground/40',
    textColor: 'text-muted-foreground/50',
    badgeBg: 'bg-muted/20',
    badgeBorder: 'border-border/30',
    buttonColor: 'bg-muted/20 hover:bg-muted/30',
  },
}

function formatTime(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDate(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function duration(start: string | Date, end: string | Date): string {
  const startDate = typeof start === 'string' ? new Date(start) : start
  const endDate = typeof end === 'string' ? new Date(end) : end
  const mins = Math.round((endDate.getTime() - startDate.getTime()) / 60000)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60),
    m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export default function MeetingsGrid({ meetings }: MeetingsGridProps) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const handleViewDetails = (projectId: number) => {
    router.push(`/workspace/${workspaceId}/projects/${projectId}/meetings`)
  }

  return (
    <div className="space-y-2">
      {meetings.map(meeting => {
        const cfg = STATUS_CONFIG[meeting.status]
        const isScheduled = meeting.status === 'SCHEDULED'

        return (
          <div
            key={meeting.id}
            className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/50 p-4 hover:bg-card transition-colors group"
          >
            {/* Time Column */}
            <div className="flex-shrink-0 w-24">
              <div className="text-[13px] font-semibold text-foreground">
                {formatTime(meeting.startTime)}
              </div>
              <div className="text-[11px] text-muted-foreground/50 mt-0.5">
                {formatDate(meeting.startTime)}
              </div>
            </div>

            {/* Divider */}
            <div className="h-10 w-px bg-border/40" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-[14px] font-semibold text-foreground truncate">
                  {meeting.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border shrink-0 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${cfg.textColor} ${cfg.badgeBg} ${cfg.badgeBorder}`}
                >
                  <span className={`h-1 w-1 rounded-full ${cfg.dotColor}`} />
                  {cfg.label}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {duration(meeting.startTime, meeting.endTime)}
                </span>
                <span className="text-muted-foreground/25">·</span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {meeting.participantCount} participant
                  {meeting.participantCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {isScheduled && (
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-colors ${cfg.buttonColor}`}
                >
                  <Video size={11} /> Join
                </a>
              )}

              <button
                onClick={() => handleViewDetails(meeting.projectId)}
                className="flex items-center gap-1.5 rounded-lg border border-border/50 px-3 py-1.5 text-[11px] font-medium text-muted-foreground/70 hover:text-foreground hover:border-border transition-colors"
              >
                View Details
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
