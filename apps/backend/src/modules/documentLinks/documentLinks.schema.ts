import z from 'zod'
import { DocumentEntityType, DocumentLinkStatus } from '../../generated/prisma/index.js'
export const idParam = z.number().int().positive().transform(Number)

export const DocumentEntityTypeSchema = z.nativeEnum(DocumentEntityType)

export const DocumentLinkStatusSchema = z.nativeEnum(DocumentLinkStatus)

export const CreateDocumentLinkSchema = z.object({
  documentId: idParam,
  entityType: DocumentEntityTypeSchema,
  entityId: idParam,
})

export const CreateDocumentLinkResponseSchema = z.object({
  id: idParam,
  documentId: idParam,
  entityType: DocumentEntityTypeSchema,
  entityId: idParam,
  createdAt: z.date(),
})

export const DocumentLinkListItemSchema = z.object({
  id: idParam,
  entityType: DocumentEntityTypeSchema,
  entityId: idParam,
  createdAt: z.date(),
})

export const ListDocumentLinksResponseSchema = z.object({
  data: z.array(DocumentLinkListItemSchema),
})

export const ListDocumentLinksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const EntityDocumentLinkListItemSchema = z.object({
  id: idParam,
  documentId: idParam,
  createdAt: z.date(),
})

export const ListEntityDocumentLinksResponseSchema = z.object({
  data: z.array(EntityDocumentLinkListItemSchema),
})

export const ListEntityDocumentLinksQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const UnlinkDocumentResponseSchema = z.object({
  id: idParam,
  status: DocumentLinkStatusSchema,
  unlinkedAt: z.date(),
})

export const documentIdParamSchema = z.object({
  documentId: z.coerce.number().int().positive(),
})
