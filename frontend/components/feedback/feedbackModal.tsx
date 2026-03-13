'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ArrowLeft, MessageSquare, Bug } from 'lucide-react'
import type { Step, Mode, FeedbackModalProps } from '@/features/feedback/types'
import type { BugFormData, FeedbackFormData } from '@/features/feedback/types'
import BugForm, { BugFormHandle } from './bugForm'
import FeedbackForm, { FeedbackFormHandle } from './feedbackForm'
import SelectStep from './selectStep'
import SuccessStep from './successStep'
import { useBugReport, useFeedback } from '@/features/feedback/hooks'

function getHeaderText(step: Step, mode: Mode) {
  if (step === 'select')
    return { title: 'How can we help?', sub: "Choose what you'd like to submit" }
  if (step === 'success')
    return { title: 'Submitted', sub: 'Thank you for your contribution' }
  if (mode === 'bug') return { title: 'Report a Bug', sub: 'Help us fix issues faster' }
  return { title: 'Share Feedback', sub: 'We read every response' }
}

function ModeChip({ mode }: { mode: Mode }) {
  if (!mode) return null
  return (
    <span
      className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider
      ${
        mode === 'bug'
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-primary/30 bg-primary/10 text-primary'
      }`}
    >
      {mode === 'bug' ? <Bug size={9} /> : <MessageSquare size={9} />}
      {mode}
    </span>
  )
}

export default function FeedbackModal({ open, onClose, projectId }: FeedbackModalProps) {
  const [step, setStep] = useState<Step>('select')
  const [mode, setMode] = useState<Mode>(null)

  const bugFormRef = useRef<BugFormHandle>(null)
  const feedbackFormRef = useRef<FeedbackFormHandle>(null)

  const bugReport = useBugReport({ projectId, onSuccess: () => setStep('success') })
  const feedback = useFeedback({ projectId, onSuccess: () => setStep('success') })

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('select')
        setMode(null)
        bugFormRef.current?.reset()
        feedbackFormRef.current?.reset()
      }, 300)
    }
  }, [open])

  function handleModeSelect(m: Mode) {
    setMode(m)
    setStep('form')
  }

  const handleBugSubmit = async (data: BugFormData): Promise<void> =>
    void bugReport.mutateAsync(data)
  const handleFeedbackSubmit = async (data: FeedbackFormData): Promise<void> =>
    void feedback.mutateAsync(data)

  if (!open) return null

  const { title, sub } = getHeaderText(step, mode)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl
          border border-border bg-card
          shadow-[0_32px_100px_oklch(0_0_0/0.5)]
          animate-in fade-in-0 slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
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
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                {step === 'form' && <ModeChip mode={mode} />}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
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

        <div className="overflow-y-auto max-h-[80vh] sm:max-h-[75vh] p-5">
          {step === 'select' && <SelectStep onSelect={handleModeSelect} />}

          <div className={step === 'form' && mode === 'bug' ? '' : 'hidden'}>
            <BugForm
              ref={bugFormRef}
              onSubmit={handleBugSubmit}
              loading={bugReport.isPending}
            />
          </div>

          <div className={step === 'form' && mode === 'feedback' ? '' : 'hidden'}>
            <FeedbackForm
              ref={feedbackFormRef}
              onSubmit={handleFeedbackSubmit}
              loading={feedback.isPending}
            />
          </div>

          {step === 'success' && <SuccessStep mode={mode} onClose={onClose} />}
        </div>
      </div>
    </div>
  )
}
