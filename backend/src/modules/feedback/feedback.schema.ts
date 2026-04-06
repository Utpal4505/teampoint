import { z } from 'zod'

export const FeedbackTypeEnum = z.enum([
  'GENERAL',
  'UI_UX',
  'PERFORMANCE',
  'FEATURE_REQUEST',
])

export const FeedbackStatusEnum = z.enum([
  'NEW',
  'REVIEWED',
  'IN_PROGRESS',
  'RESOLVED',
  'ARCHIVED',
])

export const createFeedbackSchema = z
  .object({
    projectId: z.number().optional(),
    type: FeedbackTypeEnum,
    rating: z.number().min(0).max(5).optional(),
    message: z.string().optional(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    page: z.string().optional(),
    confusion: z.string().optional(),
    slowArea: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'GENERAL' && !data.message?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please share your feedback',
        path: ['message'],
      })
    }
    if (data.type === 'FEATURE_REQUEST' && !data.problem?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe the problem',
        path: ['problem'],
      })
    }
    if (data.type === 'UI_UX' && !data.confusion?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe what felt confusing',
        path: ['confusion'],
      })
    }
    if (data.type === 'PERFORMANCE' && !data.slowArea?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe where it felt slow',
        path: ['slowArea'],
      })
    }
  })

export const updateFeedbackStatusSchema = z.object({
  id: z.number(),
  status: FeedbackStatusEnum,
  internalNotes: z.string().optional(),
})
