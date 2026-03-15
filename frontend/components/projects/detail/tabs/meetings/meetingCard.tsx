import {
  Clock,
  Users,
  ExternalLink,
  ArrowRight,
  Ban,
  CheckCircle2,
  Video,
} from 'lucide-react'
import type { Meeting } from './meetings.types'

const STATUS_CFG = {
  SCHEDULED: {
    label: 'Scheduled',
    dotColor: 'bg-emerald-400',
    textColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10',
    badgeBorder: 'border-emerald-400/20',
    barColor: 'bg-emerald-500',
  },
  COMPLETED: {
    label: 'Completed',
    dotColor: 'bg-sky-400',
    textColor: 'text-sky-400',
    badgeBg: 'bg-sky-400/10',
    badgeBorder: 'border-sky-400/20',
    barColor: 'bg-sky-500',
  },
  CANCELLED: {
    label: 'Cancelled',
    dotColor: 'bg-muted-foreground/40',
    textColor: 'text-muted-foreground/50',
    badgeBg: 'bg-muted/20',
    badgeBorder: 'border-border/30',
    barColor: 'bg-muted-foreground/30',
  },
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}
function duration(start: string, end: string) {
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000)
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60),
    m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

interface MeetingCardProps {
  meeting: Meeting
  onView: (meeting: Meeting) => void
  onCancel: (meeting: Meeting) => void
}

export default function MeetingCard({ meeting, onView, onCancel }: MeetingCardProps) {
  const cfg = STATUS_CFG[meeting.status]
  const isScheduled = meeting.status === 'SCHEDULED'
  const isCompleted = meeting.status === 'COMPLETED'
  const isCancelled = meeting.status === 'CANCELLED'
  const taskCount = meeting.actionItems.length
  const d = new Date(meeting.startTime)

  return (
    <div
      onClick={() => onView(meeting)}
      className={`group relative flex rounded-xl border bg-card/50 cursor-pointer
        transition-colors duration-150 hover:bg-card
        ${isCancelled ? 'border-border/30 opacity-50' : 'border-border/60 hover:border-border'}`}
    >
      {/* Thin left status bar */}
      <div className={`w-[3px] rounded-l-xl shrink-0 ${cfg.barColor} opacity-50`} />

      {/* Date column — neutral, no color */}
      <div
        className="flex flex-col items-center justify-center shrink-0 w-16 py-4
        border-r border-border/30"
      >
        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
          {d.toLocaleDateString('en-US', { month: 'short' })}
        </span>
        <span className="text-[22px] font-bold text-foreground/80 leading-none tabular-nums mt-0.5">
          {d.getDate()}
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wide text-muted-foreground/35 mt-0.5">
          {d.toLocaleDateString('en-US', { weekday: 'short' })}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center gap-4 px-4 py-3.5 min-w-0">
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          {/* Title + status badge */}
          <div className="flex items-center gap-2.5">
            <h3
              className={`text-[14px] font-semibold leading-tight truncate
              ${isCancelled ? 'text-foreground/40 line-through' : 'text-foreground'}`}
            >
              {meeting.title}
            </h3>
            <span
              className={`inline-flex items-center gap-1 rounded-full border shrink-0
              px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest
              ${cfg.textColor} ${cfg.badgeBg} ${cfg.badgeBorder}`}
            >
              <span className={`h-1 w-1 rounded-full ${cfg.dotColor}`} />
              {cfg.label}
            </span>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50">
            <span className="flex items-center gap-1.5">
              <Clock size={10} />
              {formatTime(meeting.startTime)} – {formatTime(meeting.endTime)}
              <span className="text-muted-foreground/30">
                · {duration(meeting.startTime, meeting.endTime)}
              </span>
            </span>
            <span className="text-muted-foreground/25">·</span>
            <span className="flex items-center gap-1">
              <Users size={10} /> {meeting.participantCount}
            </span>
            {isCompleted && taskCount > 0 && (
              <>
                <span className="text-muted-foreground/25">·</span>
                <span className="flex items-center gap-1 text-sky-400/70">
                  <CheckCircle2 size={10} />
                  {taskCount} task{taskCount !== 1 ? 's' : ''} created
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {meeting.description && !isCancelled && (
            <p className="text-[11px] text-muted-foreground/35 line-clamp-1 leading-relaxed mt-0.5">
              {meeting.description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isScheduled && (
            <a
              href={meeting.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500/90
                px-3 py-1.5 text-[11px] font-semibold text-white
                hover:bg-emerald-500 transition-colors duration-100"
            >
              <Video size={11} /> Join
            </a>
          )}

          <button
            onClick={e => {
              e.stopPropagation()
              onView(meeting)
            }}
            className="flex items-center gap-1 rounded-lg border border-border/50
              px-3 py-1.5 text-[11px] font-medium text-muted-foreground/70
              hover:text-foreground hover:border-border transition-colors duration-100"
          >
            View <ArrowRight size={10} />
          </button>

          {isScheduled && (
            <button
              onClick={e => {
                e.stopPropagation()
                onCancel(meeting)
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg
                text-muted-foreground/20 hover:text-red-400 hover:bg-red-400/10
                transition-colors duration-100 opacity-0 group-hover:opacity-100"
            >
              <Ban size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
