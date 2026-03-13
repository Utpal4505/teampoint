import { z } from 'zod'
import type { Metadata } from '@/lib/feedback-metadata'


// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const bugSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  severityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  stepsToReproduce: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
})

export const feedbackSchema = z.object({
  rating: z.number().min(0).max(5),
  message: z.string().min(1, 'Feedback is required'),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type BugFormData = z.infer<typeof bugSchema>
export type FeedbackFormData = z.infer<typeof feedbackSchema>
export type Severity = BugFormData['severityLevel']

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type Step = 'select' | 'form' | 'success'
export type Mode = 'bug' | 'feedback' | null

export interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  projectId?: number
}

// ─── Severity Config ──────────────────────────────────────────────────────────

export const SEVERITY_CONFIG: Record<
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
// import type { CapturedError } from '@/lib/feedback-consoleError'

export interface BugReportPayload {
  projectId?: number
  page?: string
  title: string
  description?: string
  consoleLog?: string
  apiRoute?: string
  attachments?: File[]
  metadata?: Metadata
  severityLevel?: Severity
  stepsToReproduce?: string
}

export interface BugReportResponse {
  id: number
  githubIssueUrl?: string
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export interface FeedbackPayload {
  projectId?: number
  rating: number
  message: string
}

export interface FeedbackResponse {
  id: number
}
