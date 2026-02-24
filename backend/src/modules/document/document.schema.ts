import { z } from 'zod'

export const CreateDocumentSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title is too long')
    .transform((val) => val.trim()),

  description: z
    .string()
    .max(2000, 'Description is too long')
    .optional()
    .transform((val) => val?.trim() ?? null),

  projectId: z
    .number({ error: 'Project ID is required' })
    .int()
    .positive(),

  uploadId: z
    .number({ error: 'Upload ID is required' })
    .int()
    .positive(),
})

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>