'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Bug,
  MessageSquare,
  X,
  ChevronRight,
  AlertTriangle,
  Upload,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Monitor,
  Globe,
  Cpu,
  Wifi,
  Clock,
} from 'lucide-react'
import { UAParser } from 'ua-parser-js'

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 'select' | 'form' | 'success'
type Mode = 'bug' | 'feedback' | null
type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface BugFormData {
  title: string
  description: string
  severityLevel: Severity
  stepsToReproduce: string
  attachments: File[]
}

interface FeedbackFormData {
  message: string
  rating: number
}

// ─── Severity Config ──────────────────────────────────────────────────────────

const SEVERITY_CONFIG: Record<
  Severity,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  LOW: {
    label: 'Low',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    dot: 'bg-amber-400',
  },
  HIGH: {
    label: 'High',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    dot: 'bg-orange-400',
  },
  CRITICAL: {
    label: 'Critical',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    dot: 'bg-red-400',
  },
}

// ─── Auto-collected metadata ──────────────────────────────────────────────────

function collectMetadata() {
  const parser = new UAParser()
  const device = parser.getResult()
  return {
    browser: device.browser.name ?? 'Unknown',
    browser_version: device.browser.version ?? 'Unknown',
    os: device.os.name ?? 'Unknown',
    os_version: device.os.version ?? 'Unknown',
    device_type: device.device.type ?? 'desktop',
    cpu_architecture: device.cpu.architecture ?? 'Unknown',
    user_agent: device.ua ?? 'Unknown',
    url: window.location.href,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    network_status: navigator.onLine ? 'online' : 'offline',
    timestamp: new Date().toISOString(),
    pageLoadTimeMs: Math.round(performance.now()),
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetadataPreview() {
  const [meta] = useState(() => collectMetadata())
  const [open, setOpen] = useState(false)

  if (!meta) return null

  const items = [
    { icon: Globe, label: 'Browser', value: `${meta.browser} ${meta.browser_version}` },
    { icon: Monitor, label: 'OS', value: `${meta.os} ${meta.os_version}` },
    { icon: Cpu, label: 'Device', value: meta.device_type },
    { icon: Wifi, label: 'Network', value: meta.network_status },
    { icon: Clock, label: 'Load', value: `${meta.pageLoadTimeMs}ms` },
  ]

  return (
    <div className="rounded-xl border border-border/40 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs text-muted-foreground hover:bg-accent/30 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium">
          <Monitor size={12} />
          Auto-collected device info
        </span>
        <ChevronRight
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-border/40 px-3.5 py-3 grid grid-cols-2 gap-2">
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon size={10} className="text-muted-foreground/50 shrink-0" />
              <span className="text-[10px] text-muted-foreground/50">{label}:</span>
              <span className="text-[10px] text-muted-foreground font-medium truncate">
                {value}
              </span>
            </div>
          ))}
          <div className="col-span-2 flex items-center gap-2">
            <Globe size={10} className="text-muted-foreground/50 shrink-0" />
            <span className="text-[10px] text-muted-foreground/50">Page:</span>
            <span className="text-[10px] text-muted-foreground font-medium truncate">
              {meta.url}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function Label({
  children,
  required,
}: {
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5
        text-sm text-foreground placeholder:text-muted-foreground/40
        focus:outline-none focus:border-border focus:bg-background
        transition-all duration-150"
    />
  )
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5
        text-sm text-foreground placeholder:text-muted-foreground/40 resize-none
        focus:outline-none focus:border-border focus:bg-background
        transition-all duration-150"
    />
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  projectId?: number
}

export default function FeedbackModal({ open, onClose, projectId }: FeedbackModalProps) {
  const [step, setStep] = useState<Step>('select')
  const [mode, setMode] = useState<Mode>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [bugForm, setBugForm] = useState<BugFormData>({
    title: '',
    description: '',
    severityLevel: 'LOW',
    stepsToReproduce: '',
    attachments: [],
  })

  const [feedbackForm, setFeedbackForm] = useState<FeedbackFormData>({
    message: '',
    rating: 0,
  })

  // Reset on close
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('select')
        setMode(null)
        setBugForm({
          title: '',
          description: '',
          severityLevel: 'LOW',
          stepsToReproduce: '',
          attachments: [],
        })
        setFeedbackForm({ message: '', rating: 0 })
      }, 300)
    }
  }, [open])

  function handleModeSelect(m: Mode) {
    setMode(m)
    setStep('form')
  }

  async function handleBugSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const meta = collectMetadata()
    const payload = {
      ...bugForm,
      projectId,
      page: meta.url,
      metadata: meta,
      consoleLog: '', // can be wired to capture console
    }
    // TODO: wire API
    console.log('Bug report payload:', payload)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setStep('success')
  }

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setStep('success')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card
          shadow-[0_24px_80px_oklch(0_0_0/0.6)]
          animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            {step === 'form' && (
              <button
                onClick={() => setStep('select')}
                className="flex h-7 w-7 items-center justify-center rounded-lg
                  text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} />
              </button>
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {step === 'select' && 'How can we help?'}
                {step === 'form' && mode === 'bug' && 'Report a Bug'}
                {step === 'form' && mode === 'feedback' && 'Share Feedback'}
                {step === 'success' && 'Thank you!'}
              </p>
              <p className="text-[11px] text-muted-foreground/60 mt-0.5">
                {step === 'select' && "Choose what you'd like to submit"}
                {step === 'form' && mode === 'bug' && 'Help us fix issues faster'}
                {step === 'form' && mode === 'feedback' && 'We read every response'}
                {step === 'success' && 'Your submission was received'}
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
        <div className="p-5">
          {/* ── Step: Select ── */}
          {step === 'select' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleModeSelect('bug')}
                className="group flex flex-col items-start gap-3 rounded-xl border border-border/60
                  bg-background/40 p-4 text-left transition-all duration-150
                  hover:border-red-500/40 hover:bg-red-500/5"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl
                  border border-border/60 bg-muted group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all"
                >
                  <Bug
                    size={16}
                    className="text-muted-foreground group-hover:text-red-400 transition-colors"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Report a Bug</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-relaxed">
                    Something broken or not working as expected?
                  </p>
                </div>
                <ChevronRight
                  size={13}
                  className="text-muted-foreground/40 group-hover:text-red-400 transition-colors self-end"
                />
              </button>

              <button
                onClick={() => handleModeSelect('feedback')}
                className="group flex flex-col items-start gap-3 rounded-xl border border-border/60
                  bg-background/40 p-4 text-left transition-all duration-150
                  hover:border-blue-500/40 hover:bg-blue-500/5"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl
                  border border-border/60 bg-muted group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-all"
                >
                  <MessageSquare
                    size={16}
                    className="text-muted-foreground group-hover:text-blue-400 transition-colors"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Give Feedback</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-0.5 leading-relaxed">
                    Share ideas, suggestions, or general thoughts.
                  </p>
                </div>
                <ChevronRight
                  size={13}
                  className="text-muted-foreground/40 group-hover:text-blue-400 transition-colors self-end"
                />
              </button>
            </div>
          )}

          {/* ── Step: Bug Form ── */}
          {step === 'form' && mode === 'bug' && (
            <form onSubmit={handleBugSubmit} className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <Label required>Title</Label>
                <Input
                  placeholder="Short summary of the issue"
                  value={bugForm.title}
                  onChange={e => setBugForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="What happened? What did you expect to happen?"
                  rows={3}
                  value={bugForm.description}
                  onChange={e => setBugForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* Severity */}
              <div>
                <Label>Severity</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(SEVERITY_CONFIG) as Severity[]).map(s => {
                    const cfg = SEVERITY_CONFIG[s]
                    const active = bugForm.severityLevel === s
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setBugForm(f => ({ ...f, severityLevel: s }))}
                        className={`flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2
                          text-[11px] font-semibold transition-all duration-150
                          ${active ? `${cfg.bg} ${cfg.border} ${cfg.color}` : 'border-border/40 bg-background/40 text-muted-foreground hover:border-border'}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full shrink-0 ${active ? cfg.dot : 'bg-muted-foreground/40'}`}
                        />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Steps to reproduce */}
              <div>
                <Label>Steps to Reproduce</Label>
                <Textarea
                  placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
                  rows={3}
                  value={bugForm.stepsToReproduce}
                  onChange={e =>
                    setBugForm(f => ({ ...f, stepsToReproduce: e.target.value }))
                  }
                />
              </div>

              {/* Attachments */}
              <div>
                <Label>Attachments</Label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-dashed border-border/50
                    px-3.5 py-3 text-xs text-muted-foreground/50 transition-all
                    hover:border-border hover:text-muted-foreground hover:bg-accent/20"
                >
                  <Upload size={13} />
                  {bugForm.attachments.length > 0
                    ? `${bugForm.attachments.length} file(s) selected`
                    : 'Attach screenshots or files'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={e =>
                    setBugForm(f => ({
                      ...f,
                      attachments: Array.from(e.target.files ?? []),
                    }))
                  }
                />
              </div>

              {/* Auto-collected info */}
              <MetadataPreview />

              {/* Severity warning */}
              {(bugForm.severityLevel === 'HIGH' ||
                bugForm.severityLevel === 'CRITICAL') && (
                <div className="flex items-start gap-2.5 rounded-xl border border-orange-500/20 bg-orange-500/5 px-3.5 py-3">
                  <AlertTriangle size={13} className="text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-orange-400/80 leading-relaxed">
                    {bugForm.severityLevel === 'CRITICAL'
                      ? 'Critical bugs are escalated immediately and a GitHub issue will be created automatically.'
                      : 'High severity bugs are prioritized in the next sprint review.'}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!bugForm.title || loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-foreground
                  px-4 py-2.5 text-sm font-semibold text-background
                  transition-all duration-150 hover:opacity-90
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Bug size={14} />
                )}
                {loading ? 'Submitting...' : 'Submit Bug Report'}
              </button>
            </form>
          )}

          {/* ── Step: Feedback Form ── */}
          {step === 'form' && mode === 'feedback' && (
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
              {/* Rating */}
              <div>
                <Label>How would you rate your experience?</Label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFeedbackForm(f => ({ ...f, rating: n }))}
                      className={`flex-1 rounded-xl border py-2.5 text-lg transition-all duration-150
                        ${
                          feedbackForm.rating >= n
                            ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                            : 'border-border/40 bg-background/40 text-muted-foreground/30 hover:border-border'
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <Label required>Your Feedback</Label>
                <Textarea
                  placeholder="Tell us what you think, what's missing, or what you love..."
                  rows={5}
                  value={feedbackForm.message}
                  onChange={e =>
                    setFeedbackForm(f => ({ ...f, message: e.target.value }))
                  }
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!feedbackForm.message || loading}
                className="flex items-center justify-center gap-2 rounded-xl bg-foreground
                  px-4 py-2.5 text-sm font-semibold text-background
                  transition-all duration-150 hover:opacity-90
                  disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <MessageSquare size={14} />
                )}
                {loading ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          )}

          {/* ── Step: Success ── */}
          {step === 'success' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl
                border border-emerald-500/20 bg-emerald-500/10"
              >
                <CheckCircle2 size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {mode === 'bug' ? 'Bug report submitted!' : 'Feedback received!'}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1.5 leading-relaxed max-w-xs">
                  {mode === 'bug'
                    ? "We've logged the issue and a GitHub issue will be created automatically. You'll be notified of updates."
                    : 'Thanks for taking the time to share your thoughts. We read every response carefully.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-border/60 bg-background/40 px-5 py-2
                  text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground
                  transition-colors duration-150"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
