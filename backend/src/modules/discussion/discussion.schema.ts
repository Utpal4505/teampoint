import { z } from 'zod'
import { DiscussionStatus, DiscussionType } from '../../generated/prisma/enums.ts'
import { sanitizeText } from '../../utils/sanitize.ts'

export const DiscussionStatusEnum = z.nativeEnum(DiscussionStatus)
export const DiscussionTypeEnum = z.nativeEnum(DiscussionType)

export const projectIdParamSchema = z.object({
  projectId: z.coerce.number().int().positive(),
})

export const discussionIdParamSchema = z.object({
  discussionId: z.coerce.number().int().positive(),
})

export const projectDiscussionParamsSchema = projectIdParamSchema.merge(
  discussionIdParamSchema,
)

export const createDiscussionSchema = z.object({
  title: z.string().trim().min(2).max(255).transform(sanitizeText),
  description: z
    .string()
    .trim()
    .max(4000)
    .optional()
    .or(z.literal(''))
    .transform(value => (value ? sanitizeText(value) : undefined)),
  type: DiscussionTypeEnum,
  contextId: z.coerce.number().int().positive().optional(),
}).superRefine((value, ctx) => {
  if (value.type === DiscussionType.TASK && !value.contextId) {
    ctx.addIssue({
      code: 'custom',
      path: ['contextId'],
      message: 'contextId is required for TASK discussions',
    })
  }
})

export const updateDiscussionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2)
    .max(255)
    .optional()
    .transform(value => (value ? sanitizeText(value) : undefined)),
  description: z
    .string()
    .trim()
    .max(4000)
    .optional()
    .or(z.literal(''))
    .transform(value => (value ? sanitizeText(value) : undefined)),
})

export const listDiscussionsQuerySchema = z.object({
  status: DiscussionStatusEnum.optional(),
  createdBy: z.coerce.number().int().positive().optional(),
  type: DiscussionTypeEnum.optional(),
  contextId: z.coerce.number().int().positive().optional(),
  includeClosed: z.coerce.boolean().optional(),
})
