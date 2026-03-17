'use client'

import { useState, useMemo } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { FAKE_MEETINGS } from './fakeData'
import MeetingsFilterBar from './meetingsFilterBar'
import MeetingCard from './meetingCard'
import MeetingDetail from './meetingDetail'
import ScheduleMeetingModal from './scheduleMeetingModal'
import CompleteMeetingModal from './completeMeetingModal'
import CancelConfirmModal from './cancelConfirmModal'
import type { Meeting, MeetingFilter } from './meetings.types'

export default function MeetingsTab() {
  const [meetings, setMeetings] = useState<Meeting[]>(FAKE_MEETINGS)
  const [filter, setFilter] = useState<MeetingFilter>('ALL')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [completeTarget, setCompleteTarget] = useState<Meeting | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Meeting | null>(null)

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
  function handleComplete(data: {
    keyDecisions: string
    actionItems: { title: string; assignedTo: number; dueDate?: string }[]
  }) {
    if (!completeTarget) return
    setMeetings(prev =>
      prev.map(m =>
        m.id === completeTarget.id
          ? {
              ...m,
              status: 'COMPLETED',
              keyDecisions: data.keyDecisions || null,
              actionItems: data.actionItems.map((item, i) => ({
                id: i + 1,
                title: item.title,
                assignedToName: `User ${item.assignedTo}`,
                dueDate: item.dueDate ?? null,
                taskId: i + 100,
              })),
            }
          : m,
      ),
    )
    setCompleteTarget(null)
  }

  function handleCancel() {
    if (!cancelTarget) return
    setMeetings(prev =>
      prev.map(m => (m.id === cancelTarget.id ? { ...m, status: 'CANCELLED' } : m)),
    )
    setCancelTarget(null)
    if (selectedId === cancelTarget.id) setSelectedId(null)
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
          onClose={() => setScheduleOpen(false)}
          onSchedule={data => {
            const newMeeting: Meeting = {
              id: Date.now(),
              title: data.title,
              description: data.description || null,
              status: 'SCHEDULED',
              startTime: data.startTime,
              endTime: data.endTime,
              meetingLink: 'https://meet.google.com/new-abc-xyz',
              participantCount: data.participants.length,
              participants: data.participants.map(p => ({
                userId: p.userId,
                name: `User ${p.userId}`,
                avatarUrl: null,
                role: p.role,
              })),
              keyDecisions: null,
              actionItems: [],
              createdAt: new Date().toISOString(),
            }
            setMeetings(prev => [newMeeting, ...prev])
            setScheduleOpen(false)
          }}
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
