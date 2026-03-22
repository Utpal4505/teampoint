import { z } from 'zod'
import { sanitizeText } from '../../utils/sanitize.ts'
import { ProjectStatus } from '../../generated/prisma/enums.ts'

export const createProjectSchema = z.object({
  workspaceId: z.number().int().positive().transform(Number),
  name: z
    .string()
    .trim()
    .min(2, 'Project name must be at least 2 characters long')
    .max(150, 'Project name must be less than 150 characters long')
    .transform(sanitizeText),
  description: z
    .string()
    .trim()
    .min(3, 'Description must be at least 3 characters long')
    .max(500, 'Description must be less than 500 characters long')
    .optional()
    .or(z.literal(''))
    .transform(v => {
      if (!v) return null
      return sanitizeText(v.trim())
    }),
})

export const projectIdParamSchema = z.object({
  projectId: z.coerce.number().int().positive().transform(Number),
})

export const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Project name must be at least 2 characters long')
      .max(150, 'Project name must be less than 150 characters long')
      .transform(sanitizeText),
    description: z
      .string()
      .trim()
      .min(3, 'Description must be at least 3 characters long')
      .max(500, 'Description must be less than 500 characters long')
      .optional()
      .or(z.literal(''))
      .or(z.null())
      .transform(v => {
        if (!v) return undefined
        return sanitizeText(v.trim())
      }),
    status: z.nativeEnum(ProjectStatus),
  })
  .partial()

export const listAllWorkspaceProjectQuerySchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  search: z.string().trim().optional(),
  createdBy: z.coerce.number().positive().optional(),
})
