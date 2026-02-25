import type z from 'zod'
import type { CreateDocumentSchema } from '../modules/document/document.schema.ts'

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

export type ListDocumentItem = {
  id: number
  title: string
  description: string | null
  fileKey: string
  fileType: string
  uploadedBy: number
  isArchived: boolean
  createdAt: Date
  updatedAt: Date
}[]

export type GetSingleDocumentDTO = {
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

export type UpdateDocumentInput = {
  documentId: number
  title?: string
  description?: string | null
  isArchived?: boolean
}

export type UpdateDocumentResponseDTO = {
  id: number
  title: string
  description: string | null
  isArchived: boolean
  updatedAt: Date
}

export type DeleteDocumentResponseDTO = {
  id: number
  title: string
  isArchived: boolean
  archivedAt: Date
}

export type DeleteDocumentInput = {
  documentId: number
}