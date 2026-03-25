'use client'

import { useImperativeHandle, forwardRef, useState } from 'react'
import { useForm, useWatch, Controller, UseFormRegister, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MessageSquare,
  Loader2,
  Sparkles,
  Gauge,
  Layout,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react'
import { Label, Textarea, FieldError } from './formElements'

// ─── Types & Schema ──────────────────────────────────────────────────────────

export type FeedbackType = 'general' | 'ui_ux' | 'performance' | 'feature_request'

export interface FeedbackFormData {
  type: FeedbackType
  rating: number
  // general
  message?: string
  // feature_request
  problem?: string
  solution?: string
  // ui_ux
  page?: string
  confusion?: string
  // performance
  slowArea?: string
}

const feedbackSchema = z
  .object({
    type: z.enum(['general', 'ui_ux', 'performance', 'feature_request']),
    rating: z.number().min(0).max(5),
    message: z.string().optional(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    page: z.string().optional(),
    confusion: z.string().optional(),
    slowArea: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'general' && !data.message?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please share your feedback', path: ['message'] })
    }
    if (data.type === 'feature_request' && !data.problem?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please describe the problem', path: ['problem'] })
    }
    if (data.type === 'ui_ux' && !data.confusion?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please describe what felt confusing', path: ['confusion'] })
    }
    if (data.type === 'performance' && !data.slowArea?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Please describe where it felt slow', path: ['slowArea'] })
    }
  })

export interface FeedbackFormHandle {
  reset: () => void
}

interface FeedbackFormProps {
  // onSubmit receives the discriminated form data — all optional fields
  // because which ones are filled depends on the selected type.
  // Callers should import FeedbackFormData from this file, not from the old types file.
  onSubmit: (data: FeedbackFormData) => Promise<void>
  loading: boolean
}

// ─── Type Config ─────────────────────────────────────────────────────────────

const TYPES: {
  id: FeedbackType
  label: string
  sub: string
  icon: React.ReactNode
  accent: string
  bg: string
  border: string
}[] = [
  {
    id: 'general',
    label: 'General',
    sub: 'Anything on your mind',
    icon: <MessageSquare size={15} />,
    accent: 'text-sky-400',
    bg: 'bg-sky-400/8',
    border: 'border-sky-400/25',
  },
  {
    id: 'ui_ux',
    label: 'UI / UX',
    sub: 'Design & usability',
    icon: <Layout size={15} />,
    accent: 'text-violet-400',
    bg: 'bg-violet-400/8',
    border: 'border-violet-400/25',
  },
  {
    id: 'performance',
    label: 'Performance',
    sub: 'Speed & responsiveness',
    icon: <Gauge size={15} />,
    accent: 'text-amber-400',
    bg: 'bg-amber-400/8',
    border: 'border-amber-400/25',
  },
  {
    id: 'feature_request',
    label: 'Feature Request',
    sub: 'Ideas & suggestions',
    icon: <Lightbulb size={15} />,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-400/8',
    border: 'border-emerald-400/25',
  },
]

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
}

const RATING_EMOJI: Record<number, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
}

// ─── Shared props for dynamic field sub-components ───────────────────────────

interface DynamicFieldProps {
  register: UseFormRegister<FeedbackFormData>
  errors: FieldErrors<FeedbackFormData>
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Input({
  placeholder,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      placeholder={placeholder}
      className={`w-full rounded-xl border bg-muted/20 px-3.5 py-2.5 text-sm text-foreground
        placeholder:text-muted-foreground/40 outline-none
        transition-all duration-150
        focus:bg-muted/30 focus:border-border
        ${error ? 'border-destructive/50' : 'border-border/60 hover:border-border'}
      `}
      {...props}
    />
  )
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center gap-2 mb-5">
      {[1, 2].map(s => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300
            ${s === step
              ? 'bg-foreground text-background'
              : s < step
              ? 'bg-primary/20 text-primary'
              : 'bg-muted/40 text-muted-foreground/40'
            }`}
          >
            {s}
          </div>
          {s === 1 && (
            <div
              className={`h-px w-8 transition-all duration-500 ${step > 1 ? 'bg-primary/40' : 'bg-border/40'}`}
            />
          )}
        </div>
      ))}
      <span className="ml-1 text-[10px] uppercase tracking-widest text-muted-foreground/40 font-semibold">
        {step === 1 ? 'Choose type' : 'Your details'}
      </span>
    </div>
  )
}

// ─── Dynamic Fields ───────────────────────────────────────────────────────────

function GeneralFields({ register, errors }: DynamicFieldProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <div>
        <Label required>Your Feedback</Label>
        <Textarea
          placeholder="Tell us what's on your mind — what you love, what frustrates you, or what could be better…"
          rows={5}
          {...register('message')}
        />
        <FieldError message={errors.message?.message} />
      </div>
    </div>
  )
}

function FeatureRequestFields({ register, errors }: DynamicFieldProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <div>
        <Label required>What problem are you facing?</Label>
        <Textarea
          placeholder="Describe the problem or gap that's slowing you down…"
          rows={3}
          {...register('problem')}
        />
        <FieldError message={errors.problem?.message} />
      </div>

      <div className="relative">
        <div className="absolute -top-px left-4 right-4 h-px bg-border/40" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label>Suggested Solution</Label>
          <span className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-wider">
            Optional
          </span>
        </div>
        <Textarea
          placeholder="How would you solve this? Even a rough idea helps…"
          rows={3}
          {...register('solution')}
        />
      </div>
    </div>
  )
}

function UIUXFields({ register, errors }: DynamicFieldProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label>Which page or area?</Label>
          <span className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-wider">
            Optional
          </span>
        </div>
        <Input placeholder="e.g. Dashboard, Settings, Onboarding…" {...register('page')} />
      </div>

      <div>
        <Label required>What felt confusing or off?</Label>
        <Textarea
          placeholder="Describe the element, flow, or layout that tripped you up…"
          rows={4}
          {...register('confusion')}
        />
        <FieldError message={errors.confusion?.message} />
      </div>
    </div>
  )
}

function PerformanceFields({ register, errors }: DynamicFieldProps) {
  return (
    <div className="flex flex-col gap-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <div>
        <Label required>Where did it feel slow?</Label>
        <Textarea
          placeholder="Describe the page, action, or feature that felt sluggish. Any details about your device or connection help too…"
          rows={5}
          {...register('slowArea')}
        />
        <FieldError message={errors.slowArea?.message} />
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const FeedbackForm = forwardRef<FeedbackFormHandle, FeedbackFormProps>(
  function FeedbackForm({ onSubmit, loading }, ref) {
    const [formStep, setFormStep] = useState<1 | 2>(1)

    const {
      register,
      handleSubmit,
      control,
      reset,
      setValue,
      formState: { errors },
    } = useForm<FeedbackFormData>({
      resolver: zodResolver(feedbackSchema),
      defaultValues: { type: undefined, rating: 0 },
    })

    useImperativeHandle(ref, () => ({
      reset: () => {
        reset()
        setFormStep(1)
      },
    }))

    const selectedType = useWatch({ control, name: 'type' })
    const rating = useWatch({ control, name: 'rating' }) ?? 0

    const selectedTypeMeta = TYPES.find(t => t.id === selectedType)

    function handleTypeSelect(type: FeedbackType) {
      setValue('type', type)
      setFormStep(2)
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-0">
        {/* Step 1 — Type selection */}
        {formStep === 1 && (
          <div className="animate-in fade-in-0 duration-200">
            <StepIndicator step={1} />

            <p className="text-[11px] text-muted-foreground/60 mb-3 font-medium">
              Select the type of feedback you&apos;d like to share
            </p>

            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeSelect(type.id)}
                  className={`group relative flex flex-col items-start gap-2 rounded-xl border p-3.5
                    transition-all duration-150 text-left
                    hover:shadow-sm active:scale-[0.98]
                    ${type.border} ${type.bg} hover:border-opacity-50`}
                >
                  <div className={`${type.accent} transition-transform duration-150 group-hover:scale-110`}>
                    {type.icon}
                  </div>
                  <div>
                    <p className={`text-[13px] font-semibold ${type.accent}`}>{type.label}</p>
                    <p className="text-[11px] text-muted-foreground/60 leading-tight mt-0.5">
                      {type.sub}
                    </p>
                  </div>
                  <ArrowRight
                    size={11}
                    className={`absolute right-3 top-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${type.accent}`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Dynamic fields */}
        {formStep === 2 && (
          <div className="animate-in fade-in-0 duration-200">
            <StepIndicator step={2} />

            {/* Selected type pill */}
            {selectedTypeMeta && (
              <div className="flex items-center gap-2 mb-5">
                <button
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60 hover:text-foreground
                    transition-colors rounded-lg px-2 py-1 hover:bg-muted/40 -ml-2"
                >
                  <ChevronLeft size={11} />
                  Change
                </button>
                <div
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1
                    ${selectedTypeMeta.border} ${selectedTypeMeta.bg}`}
                >
                  <span className={selectedTypeMeta.accent}>{selectedTypeMeta.icon}</span>
                  <span className={`text-[11px] font-semibold ${selectedTypeMeta.accent}`}>
                    {selectedTypeMeta.label}
                  </span>
                </div>
              </div>
            )}

            {/* Rating — shown for all types */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <Label>Overall Rating</Label>
                {rating > 0 && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-primary">
                    <span>{RATING_EMOJI[rating]}</span>
                    {RATING_LABELS[rating]}
                  </span>
                )}
              </div>

              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => field.onChange(n)}
                        className={`group relative flex-1 rounded-xl border py-3 transition-all duration-150
                        ${
                          field.value >= n
                            ? 'border-primary/40 bg-primary/10 text-primary shadow-sm'
                            : 'border-border bg-muted/20 text-muted-foreground/25 hover:border-border hover:bg-muted/50 hover:text-muted-foreground/50'
                        }`}
                      >
                        <span className="block text-center text-base leading-none select-none">★</span>
                      </button>
                    ))}
                  </div>
                )}
              />
              <p className="text-[10px] text-muted-foreground/40 mt-1.5 font-medium">
                Optional — but we&apos;d love to know
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-semibold">
                Details
              </span>
              <div className="h-px flex-1 bg-border/60" />
            </div>

            {/* Dynamic fields */}
            {selectedType === 'general' && (
              <GeneralFields register={register} errors={errors} />
            )}
            {selectedType === 'feature_request' && (
              <FeatureRequestFields register={register} errors={errors} />
            )}
            {selectedType === 'ui_ux' && (
              <UIUXFields register={register} errors={errors} />
            )}
            {selectedType === 'performance' && (
              <PerformanceFields register={register} errors={errors} />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl
              bg-foreground px-4 py-2.5 text-sm font-semibold text-background
              hover:opacity-90 active:scale-[0.98]
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-150"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              {loading ? 'Sending…' : 'Send Feedback'}
            </button>
          </div>
        )}
      </form>
    )
  },
)

export default FeedbackForm