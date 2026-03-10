'use client'

import { useState, useRef, useEffect } from 'react'
import {
  X,
  ChevronDown,
  Loader2,
  User,
  FolderKanban,
  AlertCircle,
  ArrowUp,
  Minus,
  ArrowDown,
  CalendarDays,
  Check,
  Sparkles,
} from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'

export type TaskType = 'PERSONAL' | 'PROJECT'
export type TaskStatus = 'TODO'
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface TaskCreatePayload {
  title: string
  description: string
  type: TaskType
  projectId: string | null
  priority: Priority
  status: TaskStatus
  dueDate: string | null
}

const MOCK_PROJECTS = [
  { id: 'p1', name: 'TeamPoint Frontend' },
  { id: 'p2', name: 'Marketing Site' },
  { id: 'p3', name: 'Mobile App' },
]

const PRIORITY_OPTIONS: {
  value: Priority
  label: string
  icon: React.ReactNode
  bg: string
  text: string
  activeBg: string
  dot: string
}[] = [
  {
    value: 'URGENT',
    label: 'Urgent',
    icon: <AlertCircle size={12} />,
    bg: 'hover:bg-destructive/8',
    text: 'text-destructive',
    activeBg: 'bg-destructive/10',
    dot: 'bg-destructive',
  },
  {
    value: 'HIGH',
    label: 'High',
    icon: <ArrowUp size={12} />,
    bg: 'hover:bg-orange-500/8',
    text: 'text-orange-400',
    activeBg: 'bg-orange-500/10',
    dot: 'bg-orange-400',
  },
  {
    value: 'MEDIUM',
    label: 'Medium',
    icon: <Minus size={12} />,
    bg: 'hover:bg-primary/8',
    text: 'text-primary',
    activeBg: 'bg-primary/10',
    dot: 'bg-primary',
  },
  {
    value: 'LOW',
    label: 'Low',
    icon: <ArrowDown size={12} />,
    bg: 'hover:bg-muted',
    text: 'text-muted-foreground',
    activeBg: 'bg-muted',
    dot: 'bg-muted-foreground',
  },
]

function PriorityDropdown({
  value,
  onChange,
}: {
  value: Priority
  onChange: (v: Priority) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = PRIORITY_OPTIONS.find(p => p.value === value)!

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex w-full items-center gap-2.5 rounded-xl border border-border
          bg-background px-3.5 py-2.5 text-sm transition-all duration-150
          hover:border-border/80 hover:bg-accent/50
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          ${selected.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${selected.dot}`} />
        <span className="flex-1 text-left font-medium">{selected.label}</span>
        <ChevronDown
          size={13}
          className={`text-muted-foreground/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 bottom-[calc(100%+6px)] z-50 overflow-hidden
          rounded-xl border border-border bg-card
          shadow-[0_-12px_40px_oklch(0_0_0/0.5)]
          animate-in fade-in-0 slide-in-from-bottom-2 duration-150"
        >
          {PRIORITY_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-sm
                transition-colors duration-100 ${opt.text} ${opt.bg}
                ${value === opt.value ? opt.activeBg : ''}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${opt.dot}`} />
              <span className="flex-1 text-left font-medium">{opt.label}</span>
              {opt.icon}
              {value === opt.value && <Check size={12} className="ml-auto" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function DatePickerField({
  value,
  onChange,
}: {
  value: Date | undefined
  onChange: (d: Date | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const formatted = value
    ? value.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex w-full items-center gap-2.5 rounded-xl border border-border
          bg-background px-3.5 py-2.5 text-sm transition-all duration-150
          hover:border-border/80 hover:bg-accent/50
          focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
          ${formatted ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <CalendarDays size={13} className="shrink-0 text-muted-foreground/60" />
        <span className="flex-1 text-left font-medium">{formatted ?? 'Pick a date'}</span>
        {value && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation()
              onChange(undefined)
            }}
            className="rounded-md p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            <X size={11} />
          </button>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 bottom-[calc(100%+6px)] z-50
          overflow-hidden rounded-xl border border-border bg-card
          shadow-[0_-12px_40px_oklch(0_0_0/0.5)]
          animate-in fade-in-0 slide-in-from-bottom-2 duration-150"
        >
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d: Date | undefined) => {
              onChange(d)
              setOpen(false)
            }}
            captionLayout="dropdown"
            className="rounded-xl"
          />
        </div>
      )}
    </div>
  )
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
      {children}
      {!required && (
        <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground/40 font-normal tracking-wide">
          optional
        </span>
      )}
    </label>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-destructive">
      <AlertCircle size={10} /> {msg}
    </p>
  )
}

interface TaskCreateModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (payload: TaskCreatePayload) => Promise<void>
}

interface FormErrors {
  title?: string
  projectId?: string
}

export function TaskCreateModal({ open, onClose, onSubmit }: TaskCreateModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TaskType>('PERSONAL')
  const [projectId, setProjectId] = useState('')
  const [priority, setPriority] = useState<Priority>('MEDIUM')
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  function validate(): boolean {
    const e: FormErrors = {}
    if (!title.trim()) e.title = 'Title is required'
    if (type === 'PROJECT' && !projectId) e.projectId = 'Select a project'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function reset() {
    setTitle('')
    setDescription('')
    setType('PERSONAL')
    setProjectId('')
    setPriority('MEDIUM')
    setDueDate(undefined)
    setErrors({})
    setLoading(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit() {
    if (!validate()) return
    const payload: TaskCreatePayload = {
      title: title.trim(),
      description: description.trim(),
      type,
      projectId: type === 'PROJECT' ? projectId : null,
      priority,
      status: 'TODO',
      dueDate: dueDate ? dueDate.toISOString() : null,
    }
    if (onSubmit) {
      setLoading(true)
      await onSubmit(payload)
      setLoading(false)
    }
    handleClose()
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.7)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        className="relative w-full max-w-[440px] rounded-2xl
        border border-border bg-card
        shadow-[0_32px_80px_oklch(0_0_0/0.7)]
        animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Top accent */}
        <div className="h-[2px] rounded-t-2xl overflow-hidden">
          <div
            className="h-full w-full"
            style={{
              background:
                'linear-gradient(90deg,transparent 0%,oklch(0.6 0.16 262/0.7) 40%,oklch(0.65 0.18 280/0.7) 60%,transparent 100%)',
            }}
          />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles size={15} />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-foreground leading-none">
                New Task
              </h2>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Fill in the details below
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg
              text-muted-foreground/60 transition-all duration-150
              hover:bg-destructive/10 hover:text-destructive"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="h-px bg-border/50 mx-6" />

        <div className="flex flex-col gap-3.5 px-6 py-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Task title</FieldLabel>
            <input
              autoFocus
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                if (errors.title) setErrors(p => ({ ...p, title: undefined }))
              }}
              placeholder="What needs to be done?"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm
                text-foreground placeholder:text-muted-foreground/30 outline-none bg-background
                transition-all duration-150
                ${
                  errors.title
                    ? 'border-destructive/50 shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.08)]'
                    : 'border-border focus:border-primary/40 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.07)]'
                }`}
            />
            <FieldError msg={errors.title} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more context…"
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background
                px-3.5 py-2.5 text-sm text-foreground
                placeholder:text-muted-foreground/30 outline-none transition-all duration-150
                focus:border-primary/40 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.07)]"
            />
          </div>

          {/* Type toggle */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Task type</FieldLabel>
            <div className="flex gap-2 rounded-xl border border-border bg-background p-1">
              {[
                { value: 'PERSONAL' as TaskType, label: 'Personal', Icon: User },
                { value: 'PROJECT' as TaskType, label: 'Project', Icon: FolderKanban },
              ].map(({ value: t, label, Icon }) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t)
                    setProjectId('')
                    setErrors(p => ({ ...p, projectId: undefined }))
                  }}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg
                    py-2 text-sm font-medium transition-all duration-150
                    ${
                      type === t
                        ? 'bg-primary/10 text-primary shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Icon size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Project */}
          {type === 'PROJECT' && (
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Project</FieldLabel>
              <div className="relative">
                <FolderKanban
                  size={13}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                />
                <select
                  value={projectId}
                  onChange={e => {
                    setProjectId(e.target.value)
                    setErrors(p => ({ ...p, projectId: undefined }))
                  }}
                  className={`w-full appearance-none rounded-xl border pl-9 pr-9 py-2.5
                    text-sm outline-none bg-background cursor-pointer transition-all duration-150
                    ${projectId ? 'text-foreground' : 'text-muted-foreground'}
                    ${errors.projectId ? 'border-destructive/50' : 'border-border'}
                    focus:border-primary/40 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.07)]`}
                >
                  <option value="" disabled>
                    Select a project…
                  </option>
                  {MOCK_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60"
                />
              </div>
              <FieldError msg={errors.projectId} />
            </div>
          )}

          {/* Priority + Due date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Priority</FieldLabel>
              <PriorityDropdown value={priority} onChange={setPriority} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Due date</FieldLabel>
              <DatePickerField value={dueDate} onChange={setDueDate} />
            </div>
          </div>

          {/* Status hint */}
          <div className="flex items-center gap-2 rounded-xl bg-muted/30 px-3.5 py-2.5 border border-border/40">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
            <span className="text-xs text-muted-foreground">
              Will be created as{' '}
              <span className="font-semibold text-foreground">To Do</span>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2.5 border-t border-border/50 px-6 py-4">
          <button
            onClick={handleClose}
            className="flex-1 rounded-xl border border-border/60 bg-background
              px-4 py-2.5 text-sm text-muted-foreground font-medium
              transition-all duration-150 hover:bg-accent hover:text-foreground
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl
              bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground
              shadow-[0_2px_16px_oklch(0.6_0.16_262/0.35)]
              transition-all duration-150
              hover:-translate-y-px hover:shadow-[0_4px_24px_oklch(0.6_0.16_262/0.5)]
              active:translate-y-0 active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {loading ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Creating…
              </>
            ) : (
              'Create Task'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
