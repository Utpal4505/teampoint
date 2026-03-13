'use client'

import { useImperativeHandle, forwardRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MessageSquare, Loader2 } from 'lucide-react'
import { Label, Textarea, FieldError } from './formElements'
import { FeedbackFormData, feedbackSchema } from '@/features/feedback/types'

export interface FeedbackFormHandle {
  reset: () => void
}

interface FeedbackFormProps {
  onSubmit: (data: FeedbackFormData) => Promise<void>
  loading: boolean
}

const RATING_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
}

const FeedbackForm = forwardRef<FeedbackFormHandle, FeedbackFormProps>(
  function FeedbackForm({ onSubmit, loading }, ref) {
    const {
      register,
      handleSubmit,
      control,
      watch,
      reset,
      formState: { errors },
    } = useForm<FeedbackFormData>({
      resolver: zodResolver(feedbackSchema),
      defaultValues: { rating: 0, message: '' },
    })

    useImperativeHandle(ref, () => ({ reset }))

    const rating = watch('rating')

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Experience Rating</Label>
            {rating > 0 && (
              <span className="text-[11px] font-medium text-primary">
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
                    <span className="block text-center text-base leading-none select-none">
                      ★
                    </span>
                  </button>
                ))}
              </div>
            )}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-semibold">
            Details
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Message */}
        <div>
          <Label required>Your Feedback</Label>
          <Textarea
            placeholder="Tell us what you think, what's missing, or what you love…"
            rows={5}
            {...register('message')}
          />
          <FieldError message={errors.message?.message} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl
          bg-foreground px-4 py-2.5 text-sm font-semibold text-background
          hover:opacity-90 active:scale-[0.98]
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150"
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <MessageSquare size={14} />
          )}
          {loading ? 'Sending…' : 'Send Feedback'}
        </button>
      </form>
    )
  },
)

export default FeedbackForm
