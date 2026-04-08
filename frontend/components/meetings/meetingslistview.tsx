'use client'

import { Clock, Users, Video, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { MeetingListItem } from '@/features/meetings/types'
import { useWorkspaceId } from '@/hooks/useworkspaceid'

interface MeetingsListViewProps {
  meetings: MeetingListItem[]
}

const STATUS_CONFIG = {
  SCHEDULED: {
    label: 'Scheduled',
    badge: 'bg-emerald-400/20 text-emerald-400 border-emerald-400/30',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  COMPLETED: {
    label: 'Completed',
    badge: 'bg-primary/20 text-primary border-primary/30',
    buttonColor: 'bg-primary/20 hover:bg-primary/30 text-primary',
  },
  CANCELLED: {
    label: 'Cancelled',
    badge: 'bg-muted/20 text-muted-foreground/60 border-border/30',
    buttonColor: 'bg-muted/20 hover:bg-muted/30 text-muted-foreground',
  },
}

function formatDateTime(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
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

export default function MeetingsListView({ meetings }: MeetingsListViewProps) {
  const router = useRouter()
  const workspaceId = useWorkspaceId()

  const handleViewDetails = (projectId: number) => {
    router.push(`/workspace/${workspaceId}/projects/${projectId}/meetings`)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            <th className="text-left py-3 px-4 font-medium">Title</th>
            <th className="text-left py-3 px-4 font-medium">Date & Time</th>
            <th className="text-left py-3 px-4 font-medium">Duration</th>
            <th className="text-left py-3 px-4 font-medium">Participants</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-right py-3 px-4 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting, idx) => {
            const cfg = STATUS_CONFIG[meeting.status]
            const isScheduled = meeting.status === 'SCHEDULED'

            return (
              <tr
                key={meeting.id}
                className={`transition-colors hover:bg-accent/50 ${
                  idx !== meetings.length - 1 ? 'border-b border-border/30' : ''
                }`}
              >
                <td className="py-3 px-4">
                  <div className="font-medium text-foreground truncate">
                    {meeting.title}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-muted-foreground/70 text-xs">
                    {formatDateTime(meeting.startTime)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                    <Clock size={12} />
                    {duration(meeting.startTime, meeting.endTime)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                    <Users size={12} />
                    {meeting.participantCount}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold border ${cfg.badge}`}
                  >
                    {cfg.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {isScheduled && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${cfg.buttonColor}`}
                      >
                        <Video size={10} />
                        Join
                      </a>
                    )}
                    <button
                      onClick={() => handleViewDetails(meeting.projectId)}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-muted-foreground/70 hover:text-foreground hover:bg-accent transition-colors text-[10px] font-semibold"
                    >
                      Details
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
