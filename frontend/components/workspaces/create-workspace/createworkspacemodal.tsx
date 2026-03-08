'use client'

import { useState } from 'react'
import { X, Loader2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react'
import {
  createWorkspaceSchema,
  type CreateWorkspacePayload,
  type CreateWorkspaceErrors,
} from '@/features/workspace/schema'

// Deterministic gradient from workspace name
function getAvatarGradient(name: string) {
  const gradients = [
    'from-[oklch(0.55_0.18_262)] to-[oklch(0.45_0.2_280)]',
    'from-[oklch(0.52_0.16_145)] to-[oklch(0.45_0.18_160)]',
    'from-[oklch(0.62_0.18_25)]  to-[oklch(0.52_0.2_340)]',
    'from-[oklch(0.58_0.16_55)]  to-[oklch(0.5_0.18_35)]',
    'from-[oklch(0.55_0.14_300)] to-[oklch(0.48_0.16_280)]',
  ]
  const i = name.charCodeAt(0) % gradients.length
  return gradients[i] || gradients[0]
}

interface Props {
  open: boolean
  onClose: () => void
  onSubmit?: (payload: CreateWorkspacePayload) => Promise<void>
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1.5 font-sans text-[11px] text-destructive mt-1.5">
      <AlertCircle size={10} className="shrink-0" /> {msg}
    </p>
  )
}

export function CreateWorkspaceModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<CreateWorkspaceErrors>({})
  const [loading, setLoading] = useState(false)

  const initials = name.trim() ? name.trim().slice(0, 2).toUpperCase() : 'WS'
  const gradient = getAvatarGradient(name || 'W')
  const hasName = name.trim().length > 0

  function validate() {
    const result = createWorkspaceSchema.safeParse({
      name,
      description: description || undefined,
    })
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors
      setErrors({ name: flat.name?.[0], description: flat.description?.[0] })
      return false
    }
    setErrors({})
    return true
  }

  function reset() {
    setName('')
    setDescription('')
    setErrors({})
    setLoading(false)
  }
  function handleClose() {
    reset()
    onClose()
  }

  async function handleSubmit() {
    if (!validate()) return

    if (onSubmit) {
      setLoading(true)
      try {
        await onSubmit({ name: name.trim(), description: description.trim() })
        handleClose()
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    return
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'oklch(0 0 0 / 0.75)' }}
      onMouseDown={e => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div
        className="relative w-full max-w-[420px] rounded-2xl border border-border bg-card
        shadow-[0_32px_80px_oklch(0_0_0/0.6)]
        animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Top shimmer */}
        <div className="overflow-hidden rounded-t-2xl">
          <div
            className="h-[2px] w-full"
            style={{
              background:
                'linear-gradient(90deg, transparent 5%, oklch(0.6 0.16 262 / 0.8) 50%, transparent 95%)',
            }}
          />
        </div>

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5">
          <div className="flex items-center gap-4">
            {/* Live avatar preview */}
            <div
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center
              rounded-2xl bg-gradient-to-br ${gradient}
              shadow-[0_4px_16px_oklch(0_0_0/0.3)] transition-all duration-300`}
            >
              <span className="font-display text-base font-bold text-white tracking-wide">
                {initials}
              </span>
              {/* Shine overlay */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'linear-gradient(135deg, oklch(1 0 0 / 0.15) 0%, transparent 60%)',
                }}
              />
            </div>

            <div>
              <h2 className="font-display text-base font-bold text-foreground leading-tight">
                {hasName ? name : 'New Workspace'}
              </h2>
              <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
                {hasName ? 'Looking good 👌' : "Set up your team's home"}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg
              border border-transparent text-muted-foreground transition-all duration-150
              hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="h-px mx-6 bg-border" />

        {/* ── Body ── */}
        <div className="flex flex-col gap-5 px-6 py-6">
          {/* Workspace name */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-sans text-xs font-semibold text-foreground">
                Workspace name
              </label>
              <span className="font-sans text-[10px] text-muted-foreground/40">
                {name.length}/100
              </span>
            </div>
            <input
              autoFocus
              value={name}
              onChange={e => {
                setName(e.target.value)
                if (errors.name) setErrors(p => ({ ...p, name: undefined }))
              }}
              placeholder="e.g. Acme Inc, Design Team…"
              maxLength={100}
              className={`w-full rounded-xl border px-4 py-3 font-sans text-sm font-medium
                text-foreground placeholder:text-muted-foreground/30 outline-none
                bg-background transition-all duration-200
                ${
                  errors.name
                    ? 'border-destructive/50 shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.1)]'
                    : 'border-border hover:border-muted-foreground/30 focus:border-primary/60 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.1)]'
                }`}
            />
            <FieldError msg={errors.name} />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="font-sans text-xs font-semibold text-foreground">
                  Description
                </label>
                <span className="rounded-md bg-muted px-[6px] py-[2px] font-sans text-[10px] text-muted-foreground/50">
                  optional
                </span>
              </div>
              <span className="font-sans text-[10px] text-muted-foreground/40">
                {description.length}/500
              </span>
            </div>
            <textarea
              value={description}
              onChange={e => {
                setDescription(e.target.value)
                if (errors.description) setErrors(p => ({ ...p, description: undefined }))
              }}
              placeholder="What does your team work on?"
              rows={3}
              maxLength={500}
              className={`w-full resize-none rounded-xl border bg-background
                px-4 py-3 font-sans text-sm text-foreground
                placeholder:text-muted-foreground/30 outline-none transition-all duration-200
                ${
                  errors.description
                    ? 'border-destructive/50 shadow-[0_0_0_3px_oklch(0.62_0.2_25/0.1)]'
                    : 'border-border hover:border-muted-foreground/30 focus:border-primary/60 focus:shadow-[0_0_0_3px_oklch(0.6_0.16_262/0.1)]'
                }`}
            />
            <FieldError msg={errors.description} />
          </div>

          {/* Hint */}
          <div
            className="flex items-center gap-2.5 rounded-xl bg-primary/5
            border border-primary/10 px-4 py-3"
          >
            <Sparkles size={13} className="shrink-0 text-primary/60" />
            <p className="font-sans text-[11px] text-muted-foreground leading-relaxed">
              You&apos;ll be able to invite teammates right after creating.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 border-t border-border px-6 py-4">
          <button
            onClick={handleClose}
            className="rounded-xl border border-border bg-background px-5 py-2.5
              font-sans text-sm font-medium text-muted-foreground
              transition-all duration-150 hover:bg-accent hover:text-foreground
              focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl
              bg-primary px-5 py-2.5 font-sans text-sm font-bold text-primary-foreground
              shadow-[0_2px_16px_oklch(0.6_0.16_262/0.35)] transition-all duration-200
              hover:-translate-y-px hover:shadow-[0_6px_24px_oklch(0.6_0.16_262/0.5)]
              active:translate-y-0 active:scale-[0.99]
              disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {loading ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Creating…
              </>
            ) : (
              <>
                Create Workspace <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
