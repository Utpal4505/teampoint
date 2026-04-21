import { z } from 'zod'
import { MessageType } from '../../generated/prisma/enums.ts'
import { sanitizeText } from '../../utils/sanitize.ts'

export const projectIdParamSchema = z.object({
  projectId: z.coerce.number().int().positive(),
})

export const discussionIdParamSchema = z.object({
  discussionId: z.coerce.number().int().positive(),
})

export const messageIdParamSchema = z.object({
  messageId: z.coerce.number().int().positive(),
})

export const createMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000).transform(sanitizeText),
  type: z.nativeEnum(MessageType).optional(),
  parentMessageId: z.coerce.number().int().positive().optional(),
})

export const updateMessageSchema = z.object({
  content: z.string().trim().min(1).max(4000).transform(sanitizeText),
})
