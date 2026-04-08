'use client'

import { ArrowRight, Video, PartyPopper, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useWorkspaceId } from '@/hooks/useworkspaceid'
import { useTodaysMeetings } from '@/features/meetings/hooks'

function getStatus(meetingTime: string | Date): 'past' | 'soon' | 'upcoming' {
  const now = new Date()
  const date = typeof meetingTime === 'string' ? new Date(meetingTime) : meetingTime
  const diff = date.getTime() - now.getTime()
  const diffMinutes = diff / (1000 * 60)
  if (diffMinutes < 0) return 'past'
  if (diffMinutes <= 30) return 'soon'
  return 'upcoming'
}

function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function TodaysMeetingsCard() {
  const workspaceId = useWorkspaceId()
  const { data: meetingsResponse, isLoading } = useTodaysMeetings(workspaceId)
  const meetings = meetingsResponse?.data ?? []

  if (isLoading) {
    return (
      <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Video size={13} className="text-primary" />
            </div>
            <h2 className="font-display text-sm font-bold text-foreground">
              Today&apos;s Meetings
            </h2>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Video size={13} className="text-primary" />
          </div>
          <h2 className="font-display text-sm font-bold text-foreground">
            {' '}
            Today&apos;s Meetings
          </h2>
        </div>
        {meetings.length > 0 && (
          <span className="rounded-full bg-primary/10 px-2 py-[2px] font-sans text-[11px] text-primary">
            {meetings.length}
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col px-2 pb-2">
        {meetings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <PartyPopper size={20} className="text-muted-foreground" />
            <p className="font-sans text-xs text-muted-foreground">
              No meetings today 🎉
            </p>
          </div>
        ) : (
          meetings.map(m => {
            const status = getStatus(new Date(m.startTime))
            const time = formatTime(new Date(m.startTime))
            return (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-lg px-3 py-[9px]
                  transition-colors duration-100 hover:bg-accent"
              >
                <span
                  className={`w-10 shrink-0 font-mono text-xs font-medium
                  ${
                    status === 'past'
                      ? 'text-muted-foreground'
                      : status === 'soon'
                        ? 'text-[oklch(0.72_0.14_55)]'
                        : 'text-primary'
                  }`}
                >
                  {time}
                </span>
                <div
                  className={`h-[6px] w-[6px] shrink-0 rounded-full
                  ${
                    status === 'past'
                      ? 'bg-border'
                      : status === 'soon'
                        ? 'bg-[oklch(0.7_0.14_55)] shadow-[0_0_5px_oklch(0.7_0.14_55/0.6)]'
                        : 'bg-primary'
                  }`}
                />
                <span
                  className={`flex-1 font-sans text-sm
                  ${status === 'past' ? 'text-muted-foreground' : 'text-foreground'}`}
                >
                  {m.title}
                </span>
                <span className="font-sans text-[11px] text-muted-foreground">
                  {m.participantCount}p
                </span>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-5 py-3">
        <Link
          href={`/workspace/${workspaceId}/meetings`}
          className="flex items-center gap-2 font-sans text-xs
            text-muted-foreground transition-colors duration-150 hover:text-foreground"
        >
          View all meetings <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}
