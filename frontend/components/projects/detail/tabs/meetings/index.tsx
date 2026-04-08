'use client'

import { useState, useMemo } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { useParams } from 'next/navigation'
import MeetingsFilterBar from './meetingsFilterBar'
import MeetingCard from './meetingCard'
import MeetingDetail from './meetingDetail'
import ScheduleMeetingModal from './scheduleMeetingModal'
import CompleteMeetingModal from './completeMeetingModal'
import CancelConfirmModal from './cancelConfirmModal'
import type { Meeting, MeetingFilter } from './meetings.types'
import {
  useProjectMeetings,
  useCreateMeeting,
  useCompleteMeeting,
  useCancelMeeting,
  useProjectMembers,
} from '@/features/projects/detail/hooks'

export default function MeetingsTab() {
  const params = useParams()
  const projectId = Number(params.projectId)

  const [filter, setFilter] = useState<MeetingFilter>('ALL')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [completeTarget, setCompleteTarget] = useState<Meeting | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Meeting | null>(null)

  const { data: meetingsData = [] } = useProjectMeetings(projectId)
  const { data: membersData = [] } = useProjectMembers(projectId)
  const createMeetingMutation = useCreateMeeting(projectId)
  const completeMeetingMutation = useCompleteMeeting(projectId)
  const cancelMeetingMutation = useCancelMeeting(projectId)

  const meetings: Meeting[] = useMemo(
    () =>
      meetingsData.map(m => ({
        id: m.id,
        title: m.title,
        description: null,
        status: m.status,
        startTime: m.startTime,
        endTime: m.endTime,
        meetingLink: m.meetingLink,
        participantCount: m.participantCount,
        participants: m.participants.map(p => ({
          userId: p.userId,
          name: p.name,
          avatarUrl: p.avatarUrl,
          role: p.role,
        })),
        keyDecisions: null,
        actionItems: [],
        createdAt: new Date().toISOString(),
      })),
    [meetingsData],
  )

  // ── Derived ───────────────────────────────────────────────
  const counts = useMemo(
    () => ({
      ALL: meetings.length,
      SCHEDULED: meetings.filter(m => m.status === 'SCHEDULED').length,
      COMPLETED: meetings.filter(m => m.status === 'COMPLETED').length,
      CANCELLED: meetings.filter(m => m.status === 'CANCELLED').length,
    }),
    [meetings],
  )

  const filtered = useMemo(
    () => (filter === 'ALL' ? meetings : meetings.filter(m => m.status === filter)),
    [meetings, filter],
  )

  const selectedMeeting = meetings.find(m => m.id === selectedId) ?? null

  // ── Handlers ──────────────────────────────────────────────
  const handleComplete = async (data: {
    keyDecisions: string
    actionItems: { title: string; assignedTo: number; dueDate?: string }[]
  }) => {
    if (!completeTarget) return
    await completeMeetingMutation.mutateAsync({
      meetingId: completeTarget.id,
      input: {
        meetingId: completeTarget.id,
        keyDecisions: data.keyDecisions || undefined,
        actionItems: data.actionItems,
      },
    })
    setCompleteTarget(null)
  }

  const handleCancel = async () => {
    if (!cancelTarget) return
    await cancelMeetingMutation.mutateAsync(cancelTarget.id)
    setCancelTarget(null)
    if (selectedId === cancelTarget.id) setSelectedId(null)
  }

  const handleSchedule = async (data: {
    title: string
    description?: string
    startTime: string
    endTime: string
    participants: Array<{ userId: number; role: 'HOST' | 'PARTICIPANT' }>
  }) => {
    await createMeetingMutation.mutateAsync({
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      participants: data.participants,
    })
    setScheduleOpen(false)
  }

  // ── Detail view ───────────────────────────────────────────
  if (selectedMeeting) {
    return (
      <>
        <MeetingDetail
          meeting={selectedMeeting}
          onBack={() => setSelectedId(null)}
          onComplete={m => setCompleteTarget(m)}
          onCancel={m => setCancelTarget(m)}
        />
        {completeTarget && (
          <CompleteMeetingModal
            meeting={completeTarget}
            onClose={() => setCompleteTarget(null)}
            onComplete={handleComplete}
          />
        )}
        {cancelTarget && (
          <CancelConfirmModal
            meeting={cancelTarget}
            onCancel={() => setCancelTarget(null)}
            onConfirm={handleCancel}
          />
        )}
      </>
    )
  }

  // ── List view ─────────────────────────────────────────────
  return (
    <>
      <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Meetings</h2>
            <p className="text-[12px] text-muted-foreground/50 mt-0.5">
              {counts.SCHEDULED} scheduled · {counts.COMPLETED} completed
            </p>
          </div>
          <button
            onClick={() => setScheduleOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 shrink-0
              text-xs font-semibold text-primary-foreground
              hover:bg-primary/90 transition-colors duration-100
              shadow-sm shadow-primary/20"
          >
            <CalendarDays size={12} /> Schedule Meeting
          </button>
        </div>

        {/* Stats strip — minimal inline */}
        <div
          className="flex items-center gap-5 text-[12px] text-muted-foreground/50
          border-b border-border/30 pb-4"
        >
          {[
            { label: 'Scheduled', value: counts.SCHEDULED, color: 'text-emerald-400' },
            { label: 'Completed', value: counts.COMPLETED, color: 'text-primary' },
            {
              label: 'Cancelled',
              value: counts.CANCELLED,
              color: 'text-muted-foreground/40',
            },
          ].map((s, i) => (
            <span key={s.label} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/20 mr-3">·</span>}
              <span className={`text-[15px] font-bold tabular-nums ${s.color}`}>
                {s.value}
              </span>
              <span className="uppercase tracking-wider text-[10px]">{s.label}</span>
            </span>
          ))}
        </div>

        {/* Filter */}
        <MeetingsFilterBar
          active={filter}
          counts={counts}
          onChange={f => {
            setFilter(f)
          }}
        />

        {/* Meeting cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl
              bg-muted/40 border border-border/60"
            >
              <Clock size={22} className="text-muted-foreground/40" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground/60">No meetings</p>
              <p className="text-[12px] text-muted-foreground/40 mt-1">
                {filter === 'ALL'
                  ? 'Schedule your first meeting.'
                  : `No ${filter.toLowerCase()} meetings.`}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(meeting => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onView={m => setSelectedId(m.id)}
                onCancel={m => setCancelTarget(m)}
              />
            ))}
          </div>
        )}
      </div>

      {scheduleOpen && (
        <ScheduleMeetingModal
          members={membersData.map(m => ({
            id: m.userId,
            name: m.fullName,
          }))}
          onClose={() => setScheduleOpen(false)}
          onSchedule={handleSchedule}
        />
      )}

      {completeTarget && (
        <CompleteMeetingModal
          meeting={completeTarget}
          onClose={() => setCompleteTarget(null)}
          onComplete={handleComplete}
        />
      )}

      {cancelTarget && (
        <CancelConfirmModal
          meeting={cancelTarget}
          onCancel={() => setCancelTarget(null)}
          onConfirm={handleCancel}
        />
      )}
    </>
  )
}
