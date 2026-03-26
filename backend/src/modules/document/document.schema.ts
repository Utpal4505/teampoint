import { z } from 'zod'
import { sanitizeText } from '../../utils/sanitize.ts'

export const CreateDocumentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title is too long')
    .transform(val => val.trim()),

  description: z
    .string()
    .max(2000, 'Description is too long')
    .optional()
    .transform(v => {
      if (v === undefined) return undefined
      if (v.trim() === '') return null
      return sanitizeText(v.trim())
    }),

  projectId: z.number().int().positive(),

  uploadId: z.number().int().positive(),
})

export const UpdateDocumentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title is too long')
    .optional()
    .transform(val => val?.trim()),
  description: z
    .string()
    .max(2000, 'Description is too long')
    .optional()
    .transform(val => val?.trim() ?? null),
  isArchived: z.boolean().optional(),
})

export const documentIdParamSchema = z.object({
  documentId: z.coerce.number().int().positive().transform(Number),
})
