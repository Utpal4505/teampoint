import { z } from 'zod'
import type {
  FeedbackTypeEnum,
  FeedbackStatusEnum,
  createFeedbackSchema,
  updateFeedbackStatusSchema,
} from '../modules/feedback/feedback.schema.ts'

export type FeedbackType = z.infer<typeof FeedbackTypeEnum>
export type FeedbackStatus = z.infer<typeof FeedbackStatusEnum>
export type CreateFeedback = z.infer<typeof createFeedbackSchema>
export type UpdateFeedbackStatus = z.infer<typeof updateFeedbackStatusSchema>
