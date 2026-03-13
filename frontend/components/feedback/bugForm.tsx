'use client'

import { useRef, useImperativeHandle, forwardRef } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bug, Upload, AlertTriangle, Loader2, Plus, X } from 'lucide-react'
import { Label, Input, Textarea, FieldError } from './formElements'
import MetadataPreview from './metadataPreview'
import { bugSchema, SEVERITY_CONFIG } from '@/features/feedback/types'
import type { BugFormData, Severity } from '@/features/feedback/types'

export interface BugFormHandle {
  reset: () => void
}

interface BugFormProps {
  onSubmit: (data: BugFormData) => Promise<void>
  loading: boolean
}

const BugForm = forwardRef<BugFormHandle, BugFormProps>(function BugForm(
  { onSubmit, loading },
  ref,
) {
  const fileRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BugFormData>({
    resolver: zodResolver(bugSchema),
    defaultValues: {
      title: '',
      description: '',
      severityLevel: 'LOW',
      stepsToReproduce: '',
      attachments: [],
    },
  })

  useImperativeHandle(ref, () => ({ reset }))

  const severityLevel = useWatch({ control, name: 'severityLevel' })
  const attachments = useWatch({ control, name: 'attachments' }) ?? []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Title */}
      <div>
        <Label required>Title</Label>
        <Input placeholder="Short summary of the issue" {...register('title')} />
        <FieldError message={errors.title?.message} />
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="What happened? What did you expect to happen?"
          rows={3}
          {...register('description')}
        />
      </div>

      {/* Severity */}
      <div>
        <Label>Severity</Label>
        <Controller
          name="severityLevel"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(SEVERITY_CONFIG) as Severity[]).map(s => {
                const cfg = SEVERITY_CONFIG[s]
                const active = field.value === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => field.onChange(s)}
                    className={`relative flex flex-col items-center gap-1.5 rounded-xl border py-3 px-2
                      text-[11px] font-semibold transition-all duration-150
                      ${
                        active
                          ? `${cfg.bg} ${cfg.border} ${cfg.color} shadow-sm`
                          : 'border-border bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/50'
                      }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${active ? cfg.dot : 'bg-muted-foreground/25'}`}
                    />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          )}
        />
      </div>

      {/* Steps to reproduce — improved UI */}
      <div>
        <Label>Steps to Reproduce</Label>
        <Controller
          name="stepsToReproduce"
          control={control}
          render={({ field }) => {
            const MAX_STEPS = 10
            const lines: string[] = field.value ? field.value.split('\n') : ['']
            const updateLines = (updated: string[]) => field.onChange(updated.join('\n'))

            const canAddStep =
              lines.length < MAX_STEPS && lines[lines.length - 1].trim() !== ''

            return (
              <div className="rounded-xl border border-border bg-muted/30 overflow-hidden">
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-0 border-b border-border/50 last:border-b-0"
                  >
                    {/* Step number */}
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center
                      text-[11px] font-semibold text-muted-foreground/50 select-none border-r border-border/50"
                    >
                      {i + 1}
                    </span>

                    {/* Input */}
                    <input
                      type="text"
                      value={line}
                      placeholder={
                        i === 0
                          ? 'Navigate to the page...'
                          : i === 1
                            ? 'Click on the element...'
                            : 'Describe what happens...'
                      }
                      onChange={e => {
                        const updated = [...lines]
                        updated[i] = e.target.value
                        updateLines(updated)
                      }}
                      onKeyDown={e => {
                        // Enter — only add new step if current line has content and under limit
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          if (line.trim() === '' || lines.length >= MAX_STEPS) return
                          const updated = [...lines]
                          updated.splice(i + 1, 0, '')
                          updateLines(updated)
                          setTimeout(() => {
                            const inputs =
                              document.querySelectorAll<HTMLInputElement>(
                                '[data-step-input]',
                              )
                            inputs[i + 1]?.focus()
                          }, 0)
                        }
                        // Backspace on empty line — remove it
                        if (e.key === 'Backspace' && line === '' && lines.length > 1) {
                          e.preventDefault()
                          const updated = lines.filter((_, idx) => idx !== i)
                          updateLines(updated)
                          setTimeout(() => {
                            const inputs =
                              document.querySelectorAll<HTMLInputElement>(
                                '[data-step-input]',
                              )
                            inputs[Math.max(0, i - 1)]?.focus()
                          }, 0)
                        }
                      }}
                      data-step-input
                      className="flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground
                        placeholder:text-muted-foreground/30 focus:outline-none"
                    />

                    {/* Remove button — only show when >1 step */}
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => updateLines(lines.filter((_, idx) => idx !== i))}
                        className="mr-2 flex h-5 w-5 items-center justify-center rounded-md
                          text-muted-foreground/0 group-hover:text-muted-foreground/40
                          hover:!text-destructive hover:bg-destructive/10
                          transition-all duration-150"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add step — disabled if last step is empty or max reached */}
                <button
                  type="button"
                  onClick={() => {
                    if (canAddStep) updateLines([...lines, ''])
                  }}
                  disabled={!canAddStep}
                  className="flex w-full items-center gap-2 px-3 py-2 border-t border-border/50
                    text-[11px] transition-all duration-150
                    disabled:opacity-30 disabled:cursor-not-allowed
                    enabled:text-muted-foreground/40 enabled:hover:text-muted-foreground enabled:hover:bg-muted/50"
                >
                  <Plus size={11} />
                  {lines.length >= MAX_STEPS
                    ? `Max ${MAX_STEPS} steps reached`
                    : 'Add step'}
                </button>
              </div>
            )
          }}
        />
      </div>

      {/* Attachments */}
      <div>
        <Label>Attachments</Label>
        <Controller
          name="attachments"
          control={control}
          render={({ field }) => (
            <>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl
                  border border-dashed border-border px-3.5 py-3.5
                  text-xs text-muted-foreground/50 bg-muted/20
                  hover:border-ring/50 hover:text-muted-foreground hover:bg-muted/40
                  transition-all duration-150"
              >
                <Upload size={13} />
                {(field.value?.length ?? 0) > 0
                  ? `${field.value!.length} file(s) attached`
                  : 'Attach screenshots or files'}
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                className="hidden"
                onChange={e => field.onChange(Array.from(e.target.files ?? []))}
              />
            </>
          )}
        />
      </div>

      {/* Auto-collected device info */}
      <MetadataPreview />

      {/* Severity warning */}
      {(severityLevel === 'HIGH' || severityLevel === 'CRITICAL') && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <AlertTriangle size={13} className="text-destructive shrink-0 mt-0.5" />
          <p className="text-[11px] text-destructive/80 leading-relaxed">
            {severityLevel === 'CRITICAL'
              ? 'Critical bugs are escalated immediately — a GitHub issue will be created automatically.'
              : 'High severity bugs are prioritized for the next sprint.'}
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 rounded-xl
          bg-foreground px-4 py-2.5 text-sm font-semibold text-background
          hover:opacity-90 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Bug size={14} />}
        {loading ? 'Submitting…' : 'Submit Bug Report'}
      </button>
    </form>
  )
})

export default BugForm
