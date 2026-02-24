import type z from "zod"
import type { CreateDocumentSchema } from "../modules/document/document.schema.ts"

export type CreateDocumentInput = z.infer<typeof CreateDocumentSchema>

export type CreateDocumentDTO = {
  id: number
  projectId: number
  uploadedBy: number
  title: string
  description: string | null
  fileKey: string
  fileType: string
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}
