import z from 'zod'
import { DocumentEntityType, DocumentLinkStatus } from '../../generated/prisma/enums.ts'
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

export const EntityDocumentLinkListItemSchema = z.object({
  id: idParam,
  documentId: idParam,
  createdAt: z.date(),
})

export const ListEntityDocumentLinksResponseSchema = z.object({
  data: z.array(EntityDocumentLinkListItemSchema),
})

export const UnlinkDocumentResponseSchema = z.object({
  id: idParam,
  status: DocumentLinkStatusSchema,
  unlinkedAt: z.date(),
})

export const documentIdParamSchema = z.object({
  documentId: z.coerce.number().int().positive(),
})
