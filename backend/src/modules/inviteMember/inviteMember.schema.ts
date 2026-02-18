import { z } from 'zod'
import { sanitizeText } from '../../utils/sanitize.ts'

export const sendInviteSchema = z.object({
  email: z.string().trim().email('Invalid email address').transform(sanitizeText),
  role: z.enum(['MEMBER', 'ADMIN']),
})

export const inviteIdParamSchema = z.object({
  workspaceId: z.number().int().positive().transform(Number),
  inviteId: z.number().int().positive().transform(Number),
})

export const acceptInviteSchema = z.object({
  token: z.string().trim().min(1, 'Token is required'),
  tokenId: z.number().int().positive().transform(Number),
})
