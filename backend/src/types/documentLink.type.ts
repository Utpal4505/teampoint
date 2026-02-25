import type { DocumentEntityType, DocumentLinkStatus } from '../generated/prisma/enums.ts'

export interface CreateDocumentLinkInput {
  documentId: number
  entityType: DocumentEntityType
  entityId: number
}

export interface CreateDocumentLinkResponse {
  id: number
  documentId: number
  entityType: DocumentEntityType
  entityId: number
  createdAt: Date
}

export interface DocumentLinkListItem {
  id: number
  entityType: DocumentEntityType
  entityId: number
  createdAt: Date
}

export interface ListDocumentLinksResponse {
  data: DocumentLinkListItem[]
}

export interface EntityDocumentLinkListItem {
  id: number
  documentId: number
  createdAt: Date
}

export interface ListEntityDocumentLinksResponse {
  data: EntityDocumentLinkListItem[]
}

export interface UnlinkDocumentResponse {
  id: number
  status: DocumentLinkStatus
  unlinkedAt: Date
}
