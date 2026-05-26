import { z } from 'zod'
import type { Metadata } from '@/lib/feedback-metadata'

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

export const BUG_ATTACHMENT_LIMITS = {
  maxFiles: 3,
  maxSize: 4 * 1024 * 1024,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const

const imageFileSchema = z
  .custom<File>(file => typeof File !== 'undefined' && file instanceof File, {
    message: 'Please select an image file',
  })
  .refine(
    file =>
      (BUG_ATTACHMENT_LIMITS.acceptedTypes as readonly string[]).includes(file.type),
    {
      message: 'Only JPG, PNG, WebP, or GIF images are supported',
    },
  )
  .refine(file => file.size <= BUG_ATTACHMENT_LIMITS.maxSize, {
    message: 'Each image must be 4MB or smaller',
  })

export const bugSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  severityLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  stepsToReproduce: z.string().optional(),
  attachments: z
    .array(imageFileSchema)
    .max(BUG_ATTACHMENT_LIMITS.maxFiles, 'You can attach up to 3 images')
    .optional(),
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

export interface BugAttachment {
  uploadId: number
  fileKey: string
  fileName: string
  contentType: (typeof BUG_ATTACHMENT_LIMITS.acceptedTypes)[number]
  size: number
}

export interface BugReportPayload {
  projectId?: number
  page?: string
  title: string
  description?: string
  consoleLog?: string
  apiRoute?: string
  attachments?: BugAttachment[]
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
  type: 'GENERAL' | 'UI_UX' | 'PERFORMANCE' | 'FEATURE_REQUEST'
  rating?: number
  message?: string
  problem?: string
  solution?: string
  page?: string
  confusion?: string
  slowArea?: string
}

export interface FeedbackResponse {
  id: number
  submittedBy?: number | null
  projectId?: number | null
  type: string
  rating?: number | null
  message?: string | null
  problem?: string | null
  solution?: string | null
  page?: string | null
  confusion?: string | null
  slowArea?: string | null
  status: string
  createdAt: string
  updatedAt: string
}
