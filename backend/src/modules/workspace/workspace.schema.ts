import { z } from 'zod'
import { sanitizeText } from '../../utils/sanitize.ts'

export const createWorkspaceSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, 'Workspace name must be at least 2 characters long')
    .max(100, 'Workspace name must be less than 100 characters long')
    .transform(sanitizeText),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description must be less than 500 characters long')
    .optional()
    .or(z.literal(''))
    .transform(v => {
      if (!v) return undefined
      return sanitizeText(v.trim())
    }),
})

export const workspaceIdParamSchema = z.object({
  workspaceId: z.number().int().positive().transform(Number),
})
