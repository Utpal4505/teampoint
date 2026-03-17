import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  CheckCircle2,
  Ban,
  Crown,
  User,
  Zap,
  ClipboardList,
  Video,
} from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Meeting } from './meetings.types'

const STATUS_CFG = {
  SCHEDULED: {
    label: 'Scheduled',
    dot: 'bg-emerald-400',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  COMPLETED: {
    label: 'Completed',
    dot: 'bg-primary',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  CANCELLED: {
    label: 'Cancelled',
    dot: 'bg-muted-foreground/40',
    color: 'text-muted-foreground/50',
    bg: 'bg-muted/20',
    border: 'border-border/30',
  },
}

function formatFullDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
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
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60),
    m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? 's' : ''}`
}

interface MeetingDetailProps {
  meeting: Meeting
  onBack: () => void
  onComplete: (meeting: Meeting) => void
  onCancel: (meeting: Meeting) => void
}

export default function MeetingDetail({
  meeting,
  onBack,
  onComplete,
  onCancel,
}: MeetingDetailProps) {
  const cfg = STATUS_CFG[meeting.status]
  const isScheduled = meeting.status === 'SCHEDULED'
  const isCompleted = meeting.status === 'COMPLETED'

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="px-6 py-5 flex flex-col gap-4 max-w-4xl">
          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[12px] text-muted-foreground/50
              hover:text-muted-foreground transition-colors duration-100 w-fit"
          >
            <ArrowLeft size={12} /> Back to Meetings
          </button>

          {/* Title + actions */}
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-2 min-w-0 flex-1">
              {/* Title + badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[22px] font-bold text-foreground leading-tight">
                  {meeting.title}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border shrink-0
                  px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest
                  ${cfg.color} ${cfg.bg} ${cfg.border}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 flex-wrap text-[12px] text-muted-foreground/55">
                <span className="flex items-center gap-1.5">
                  <Calendar size={11} className="text-muted-foreground/35" />
                  {formatFullDate(meeting.startTime)}
                </span>
                <span className="text-muted-foreground/25">·</span>
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-muted-foreground/35" />
                  {formatTime(meeting.startTime)} – {formatTime(meeting.endTime)}
                  <span className="text-muted-foreground/35">
                    · {duration(meeting.startTime, meeting.endTime)}
                  </span>
                </span>
                <span className="text-muted-foreground/25">·</span>
                <span className="flex items-center gap-1.5">
                  <Users size={11} className="text-muted-foreground/35" />
                  {meeting.participantCount} participant
                  {meeting.participantCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Description */}
              {meeting.description && (
                <p className="text-[13px] text-muted-foreground/55 leading-relaxed max-w-2xl">
                  {meeting.description}
                </p>
              )}
            </div>

            {/* Actions — scheduled only */}
            {isScheduled && (
              <div className="flex flex-col gap-2 shrink-0 min-w-[160px]">
                <a
                  href={meeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl
                    bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white
                    hover:bg-emerald-600 transition-colors duration-100"
                >
                  <Video size={14} /> Join Meeting
                </a>
                <div className="flex gap-2">
                  <button
                    onClick={() => onComplete(meeting)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg
                      border border-border/60 bg-muted/20 px-3 py-2
                      text-xs font-medium text-muted-foreground/70
                      hover:bg-accent hover:text-foreground transition-colors duration-100"
                  >
                    <CheckCircle2 size={12} /> Complete
                  </button>
                  <button
                    onClick={() => onCancel(meeting)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg
                      border border-border/60 bg-muted/20 px-3 py-2
                      text-xs font-medium text-muted-foreground/70
                      hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20
                      transition-colors duration-100"
                  >
                    <Ban size={12} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col gap-8 max-w-4xl">
        {/* Participants */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-widest">
              Participants
            </p>
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-[11px] text-muted-foreground/30 tabular-nums">
              {meeting.participantCount}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {meeting.participants.map(p => (
              <div
                key={p.userId}
                className={`flex items-center gap-3 rounded-xl border px-3 py-3
                  transition-colors duration-100
                  ${
                    p.role === 'HOST'
                      ? 'border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/8'
                      : 'border-border/40 bg-muted/10 hover:bg-muted/20'
                  }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-full text-[11px] font-bold
                  ${
                    p.role === 'HOST'
                      ? 'bg-amber-400/15 text-amber-500'
                      : 'bg-muted/60 text-muted-foreground'
                  }`}
                >
                  {getInitials(p.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-foreground truncate">
                    {p.name}
                  </p>
                  <span
                    className={`flex items-center gap-1 text-[10px] font-medium mt-0.5
                    ${p.role === 'HOST' ? 'text-amber-400/80' : 'text-muted-foreground/40'}`}
                  >
                    {p.role === 'HOST' ? (
                      <>
                        <Crown size={8} /> Host
                      </>
                    ) : (
                      <>
                        <User size={8} /> Participant
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed outcomes */}
        {isCompleted && (
          <>
            {/* Key decisions */}
            {meeting.keyDecisions && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-widest">
                    Key Decisions
                  </p>
                  <div className="flex-1 h-px bg-border/30" />
                </div>
                <div
                  className="rounded-xl border border-border/40 bg-muted/10 px-4 py-3.5
                  relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/40" />
                  <p className="text-[13px] text-foreground/75 leading-relaxed whitespace-pre-wrap pl-3">
                    {meeting.keyDecisions}
                  </p>
                </div>
              </div>
            )}

            {/* Action items */}
            {meeting.actionItems.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <p
                    className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-widest
                    flex items-center gap-1.5"
                  >
                    <Zap size={10} /> Action Items
                  </p>
                  <div className="flex-1 h-px bg-border/30" />
                  <span className="text-[11px] text-muted-foreground/30 tabular-nums">
                    {meeting.actionItems.length}
                  </span>
                </div>

                <div
                  className="flex flex-col divide-y divide-border/30
                  rounded-xl border border-border/40 overflow-hidden"
                >
                  {meeting.actionItems.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-4 py-3
                        bg-muted/5 hover:bg-muted/15 transition-colors duration-100"
                    >
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center
                        rounded-full bg-muted/40 text-[9px] font-bold text-muted-foreground/50"
                      >
                        {i + 1}
                      </span>
                      <span className="flex-1 text-[13px] font-medium text-foreground/80 truncate">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground/45">
                          {item.assignedToName}
                        </span>
                        {item.dueDate && (
                          <span className="text-[10px] text-muted-foreground/35 tabular-nums">
                            {new Date(item.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                        {item.taskId && (
                          <span
                            className="flex items-center gap-0.5 text-[9px] font-semibold
                            text-primary/70 bg-primary/8 border border-primary/15
                            px-1.5 py-0.5 rounded-full"
                          >
                            <CheckCircle2 size={8} /> Task
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
