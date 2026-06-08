import { z } from 'zod'

export const BugReportStatusEnum = z.enum([
  'PENDING',
  'PROCESSING',
  'DUPLICATE',
  'AI_PROCESSED',
  'GITHUB_CREATED',
  'FAILED',
  'RESOLVED',
])

export const SeverityLevelEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

export const BugAttachmentSchema = z.object({
  uploadId: z.number().int().positive(),
  fileKey: z.string().min(1),
  fileName: z.string().min(1).max(100),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  size: z.number().int().positive().max(4 * 1024 * 1024),
})

export const createBugReportSchema = z.object({
  projectId: z.number().optional(),
  page: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required').optional(),
  consoleLog: z.string().optional(),
  apiRoute: z.string().optional(),
  attachments: z.array(BugAttachmentSchema).max(3).optional(),
  metadata: z.any().optional(),
  severityLevel: SeverityLevelEnum.optional(),
  stepsToReproduce: z.string().optional(),
})

export const updateBugReportStatusSchema = z.object({
  id: z.number(),
  status: BugReportStatusEnum,
})

export const updateBugReportSeveritySchema = z.object({
  id: z.number(),
  severityScore: z.number().optional(),
  possibleCause: z.string().optional(),
  aiSummary: z.string().optional(),
  aiTags: z.any().optional(),
})
