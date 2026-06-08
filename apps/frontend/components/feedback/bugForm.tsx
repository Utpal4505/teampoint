'use client'

import { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bug, Upload, AlertTriangle, Loader2, Plus, X } from 'lucide-react'
import { Label, Input, Textarea, FieldError } from './formElements'
import MetadataPreview from './metadataPreview'
import {
  bugSchema,
  BUG_ATTACHMENT_LIMITS,
  SEVERITY_CONFIG,
} from '@/features/feedback/types'
import type { BugFormData, Severity } from '@/features/feedback/types'

export interface BugFormHandle {
  reset: () => void
}

interface BugFormProps {
  onSubmit: (data: BugFormData) => Promise<void>
  loading: boolean
}

function BugImagePreview({
  file,
  index,
  disabled,
  onRemove,
}: {
  file: File
  index: number
  disabled: boolean
  onRemove: (index: number) => void
}) {
  const [previewUrl] = useState(() => URL.createObjectURL(file))

  useEffect(() => {
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-muted/30">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={previewUrl} alt={file.name} className="aspect-video w-full object-cover" />
      <button
        type="button"
        onClick={() => onRemove(index)}
        disabled={disabled}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center
          rounded-md bg-background/90 text-muted-foreground shadow-sm
          transition-colors hover:text-destructive disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Remove ${file.name}`}
      >
        <X size={12} />
      </button>
      <div className="truncate border-t border-border bg-background/90 px-2 py-1.5 text-[10px] text-muted-foreground">
        {file.name}
      </div>
    </div>
  )
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

      {/* Optional images */}
      <div>
        <Label>Images</Label>
        <Controller
          name="attachments"
          control={control}
          render={({ field }) => {
            const currentFiles = field.value ?? []
            const hasReachedLimit =
              currentFiles.length >= BUG_ATTACHMENT_LIMITS.maxFiles

            const addFiles = (fileList: FileList | File[]) => {
              const incoming = Array.from(fileList).filter(file =>
                (BUG_ATTACHMENT_LIMITS.acceptedTypes as readonly string[]).includes(
                  file.type,
                ),
              )
              const filesByKey = new Map(
                [...currentFiles, ...incoming].map(file => [
                  `${file.name}-${file.size}-${file.lastModified}`,
                  file,
                ]),
              )
              field.onChange(
                Array.from(filesByKey.values()).slice(
                  0,
                  BUG_ATTACHMENT_LIMITS.maxFiles,
                ),
              )
            }

            const removeFile = (index: number) => {
              field.onChange(currentFiles.filter((_, fileIndex) => fileIndex !== index))
            }

            return (
              <div className="space-y-3">
                <input
                  ref={fileRef}
                  type="file"
                  accept={BUG_ATTACHMENT_LIMITS.acceptedTypes.join(',')}
                  multiple
                  className="hidden"
                  onChange={e => {
                    if (e.target.files) addFiles(e.target.files)
                    e.currentTarget.value = ''
                  }}
                />

                <button
                  type="button"
                  disabled={hasReachedLimit || loading}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    if (!hasReachedLimit) addFiles(e.dataTransfer.files)
                  }}
                  className="flex min-h-24 w-full flex-col items-center justify-center gap-2
                    rounded-xl border border-dashed border-border bg-muted/25 px-4 py-4
                    text-center transition-all duration-150
                    hover:border-ring hover:bg-muted/40
                    disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-muted-foreground">
                    <Upload size={15} />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    Add optional screenshots
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    JPG, PNG, WebP, or GIF. Up to {BUG_ATTACHMENT_LIMITS.maxFiles}{' '}
                    images, 4MB each.
                  </span>
                </button>

                {currentFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {currentFiles.map((file, index) => (
                      <BugImagePreview
                        key={`${file.name}-${file.size}-${file.lastModified}`}
                        file={file}
                        index={index}
                        disabled={loading}
                        onRemove={removeFile}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          }}
        />
        <FieldError message={errors.attachments?.message} />
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

                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => updateLines(lines.filter((_, idx) => idx !== i))}
                        className="mr-2 flex h-5 w-5 items-center justify-center rounded-md
                          text-muted-foreground/0 group-hover:text-muted-foreground/40
                          hover:text-destructive hover:bg-destructive/10
                          transition-all duration-150"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </div>
                ))}
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
