import { z } from 'zod'

const sanitizeText = (v: string) => v.replace(/<[^>]*>/g, '').trim()

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Workspace name must be at least 2 characters')
    .max(100, 'Workspace name must be less than 100 characters')
    .transform(sanitizeText),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters')
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal(''))
    .transform((v) => (!v ? null : sanitizeText(v.trim()))),
})

export interface CreateWorkspacePayload {
  name:        string
  description: string
}

export interface CreateWorkspaceErrors {
  name?:        string
  description?: string
}