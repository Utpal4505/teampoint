import { Activity } from 'lucide-react'
import { FieldLabel, FieldError } from './fieldhelpers'
import { StatusSelector } from './statusselector'
import { ProjectStatus, Step1Errors } from '@/features/projects/schemas'

interface Step1DetailsProps {
  name: string
  description: string
  status: ProjectStatus
  errors: Step1Errors
  onNameChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onStatusChange: (v: ProjectStatus) => void
}

export function Step1Details({
  name,
  description,
  status,
  errors,
  onNameChange,
  onDescriptionChange,
  onStatusChange,
}: Step1DetailsProps) {
  return (
    <div className="flex flex-col gap-4 px-6 py-5">
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Project name</FieldLabel>
        <div className="relative">
          <input
            autoFocus
            value={name}
            onChange={e => onNameChange(e.target.value)}
            placeholder="e.g. Website Redesign"
            maxLength={150}
            className={`w-full rounded-xl border px-4 py-3 pr-14 font-sans text-sm
              text-foreground placeholder:text-muted-foreground/35 outline-none bg-background
              transition-all duration-150
              ${
                errors.name
                  ? 'border-destructive/60 shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.1)]'
                  : 'border-border focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]'
              }`}
          />
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2
            font-sans text-[10px] text-muted-foreground/35"
          >
            {name.length}/150
          </span>
        </div>
        <FieldError msg={errors.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Description</FieldLabel>
        <div className="relative">
          <textarea
            value={description}
            onChange={e => onDescriptionChange(e.target.value)}
            placeholder="What is this project about?"
            rows={3}
            maxLength={500}
            className={`w-full resize-none rounded-xl border bg-background
              px-4 py-3 pb-6 font-sans text-sm text-foreground
              placeholder:text-muted-foreground/35 outline-none transition-all duration-150
              ${
                errors.description
                  ? 'border-destructive/60 shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.1)]'
                  : 'border-border focus:border-primary/50 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.08)]'
              }`}
          />
          <span
            className="pointer-events-none absolute bottom-2.5 right-4
            font-sans text-[10px] text-muted-foreground/35"
          >
            {description.length}/500
          </span>
        </div>
        <FieldError msg={errors.description} />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel required>Initial status</FieldLabel>
        <StatusSelector value={status} onChange={onStatusChange} />
      </div>

      <div className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/20 px-4 py-3">
        <Activity size={12} className="shrink-0 text-muted-foreground/60" />
        <span className="font-sans text-[11px] text-muted-foreground">
          You&apos;ll invite workspace members in the next step
        </span>
      </div>
    </div>
  )
}
