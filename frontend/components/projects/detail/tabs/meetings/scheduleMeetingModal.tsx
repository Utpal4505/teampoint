'use client'

import { useState } from 'react'
import { X, CalendarDays, Plus, Trash2, Users } from 'lucide-react'
import { getInitials } from '@/lib/utils'

const FAKE_MEMBERS = [
  { id: 1, name: 'Utpal Kumar' },
  { id: 2, name: 'Rahul Sharma' },
  { id: 3, name: 'Aman Verma' },
  { id: 4, name: 'Neha Singh' },
  { id: 5, name: 'Dev Patel' },
]

interface ParticipantEntry {
  userId: number
  name: string
  role: 'HOST' | 'PARTICIPANT'
}

interface ScheduleMeetingModalProps {
  onClose: () => void
  onSchedule: (data: {
    title: string
    description: string
    startTime: string
    endTime: string
    participants: { userId: number; role: 'HOST' | 'PARTICIPANT' }[]
  }) => void
}

export default function ScheduleMeetingModal({
  onClose,
  onSchedule,
}: ScheduleMeetingModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('11:00')
  const [participants, setParticipants] = useState<ParticipantEntry[]>([
    { userId: 1, name: 'Utpal Kumar', role: 'HOST' },
  ])

  const canSubmit =
    title.trim().length > 0 &&
    date.length > 0 &&
    startTime < endTime &&
    participants.length > 0

  // Members not yet added
  const available = FAKE_MEMBERS.filter(m => !participants.find(p => p.userId === m.id))

  function addParticipant(memberId: number) {
    const member = FAKE_MEMBERS.find(m => m.id === memberId)
    if (!member) return
    setParticipants(prev => [
      ...prev,
      { userId: member.id, name: member.name, role: 'PARTICIPANT' },
    ])
  }

  function removeParticipant(userId: number) {
    setParticipants(prev => prev.filter(p => p.userId !== userId))
  }

  function toggleRole(userId: number) {
    setParticipants(prev =>
      prev.map(p =>
        p.userId === userId
          ? { ...p, role: p.role === 'HOST' ? 'PARTICIPANT' : 'HOST' }
          : p,
      ),
    )
  }

  function handleSubmit() {
    if (!canSubmit) return
    const startISO = new Date(`${date}T${startTime}:00`).toISOString()
    const endISO = new Date(`${date}T${endTime}:00`).toISOString()
    onSchedule({
      title: title.trim(),
      description: description.trim(),
      startTime: startISO,
      endTime: endISO,
      participants: participants.map(p => ({ userId: p.userId, role: p.role })),
    })
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

      <div
        className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2
          w-full max-w-[480px] rounded-2xl border border-border bg-background
          shadow-2xl shadow-black/25 flex flex-col overflow-hidden"
        style={{ maxHeight: '88vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays size={13} className="text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Schedule Meeting</h2>
              <p className="text-[11px] text-muted-foreground/50">
                A Google Meet link will be auto-generated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 p-5 overflow-y-auto flex-1">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold text-muted-foreground/70
              uppercase tracking-wider"
            >
              Title <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Sprint Planning"
              autoFocus
              className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm
                text-foreground placeholder:text-muted-foreground/30 outline-none
                focus:border-primary/40 focus:bg-background transition-colors duration-100"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold text-muted-foreground/70
              uppercase tracking-wider"
            >
              Description
              <span
                className="ml-1.5 text-[10px] normal-case font-normal
                text-muted-foreground/40"
              >
                optional
              </span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this meeting about?"
              rows={2}
              className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm
                text-foreground placeholder:text-muted-foreground/30 outline-none resize-none
                focus:border-primary/40 focus:bg-background transition-colors duration-100"
            />
          </div>

          {/* Date + Time row */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[11px] font-semibold text-muted-foreground/70
              uppercase tracking-wider"
            >
              Date & Time <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="col-span-1 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5
                  text-sm text-foreground outline-none
                  focus:border-primary/40 focus:bg-background transition-colors duration-100"
              />
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="flex-1 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5
                    text-sm text-foreground outline-none
                    focus:border-primary/40 focus:bg-background transition-colors duration-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/50 shrink-0">to</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="flex-1 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5
                    text-sm text-foreground outline-none
                    focus:border-primary/40 focus:bg-background transition-colors duration-100"
                />
              </div>
            </div>
            {startTime >= endTime && date && (
              <p className="text-[11px] text-red-400">
                End time must be after start time
              </p>
            )}
          </div>

          {/* Participants */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                className="text-[11px] font-semibold text-muted-foreground/70
                uppercase tracking-wider flex items-center gap-1.5"
              >
                <Users size={11} /> Participants
              </label>
              <span className="text-[10px] text-muted-foreground/40">
                HOST role receives the Google Meet link
              </span>
            </div>

            {/* Added participants */}
            <div className="flex flex-col gap-1.5">
              {participants.map(p => (
                <div
                  key={p.userId}
                  className="flex items-center gap-3 rounded-xl border border-border/50
                    bg-muted/10 px-3 py-2"
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center
                    rounded-full bg-primary/15 text-[10px] font-bold text-primary"
                  >
                    {getInitials(p.name)}
                  </div>
                  <span className="flex-1 text-xs font-medium text-foreground truncate">
                    {p.name}
                  </span>
                  <button
                    onClick={() => toggleRole(p.userId)}
                    className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold
                      uppercase tracking-wider transition-colors duration-100
                      ${
                        p.role === 'HOST'
                          ? 'bg-amber-400/15 border-amber-400/30 text-amber-500'
                          : 'bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted/60'
                      }`}
                  >
                    {p.role}
                  </button>
                  <button
                    onClick={() => removeParticipant(p.userId)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg
                      text-muted-foreground/30 hover:bg-red-500/10 hover:text-red-400
                      transition-colors duration-100"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add participant dropdown */}
            {available.length > 0 && (
              <select
                value=""
                onChange={e => {
                  if (e.target.value) addParticipant(Number(e.target.value))
                }}
                className="rounded-xl border border-dashed border-border/60 bg-muted/10
                  px-3 py-2.5 text-xs text-muted-foreground outline-none
                  hover:bg-muted/20 transition-colors duration-100 cursor-pointer"
              >
                <option value="">+ Add participant…</option>
                {available.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4
          border-t border-border/60 bg-muted/10 shrink-0"
        >
          <button
            onClick={onClose}
            className="rounded-xl border border-border/60 bg-background px-4 py-2
              text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground
              transition-colors duration-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2
              text-xs font-semibold text-primary-foreground
              hover:bg-primary/90 transition-colors duration-100
              disabled:opacity-35 disabled:cursor-not-allowed"
          >
            <CalendarDays size={11} /> Schedule
          </button>
        </div>
      </div>
    </>
  )
}
