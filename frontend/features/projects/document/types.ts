export type DocumentEntityType = 'TASK' | 'DISCUSSION' | 'MILESTONE' | 'MEETING'
export type DocumentFilter = 'ALL' | 'LINKED' | 'UNLINKED' | 'ARCHIVED'

export interface DocumentLink {
  id: number
  entityType: DocumentEntityType
  entityId: number
  createdAt: string
}

export interface Document {
  id: number
  projectId: number
  uploadedBy: number
  title: string
  description: string | null
  fileKey: string
  fileType: string // MIME type
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface DocumentWithLinks extends Document {
  links: DocumentLink[]
  uploaderName?: string
}

export interface CreateDocumentInput {
  title: string
  description?: string
  projectId: number
  uploadId: number
}

export interface UpdateDocumentInput {
  title?: string
  description?: string | null
  isArchived?: boolean
}

export interface CreateDocumentLinkInput {
  documentId: number
  entityType: DocumentEntityType
  entityId: number
}

export interface DocumentResponse {
  id: number
  projectId: number
  uploadedBy: number
  title: string
  description: string | null
  fileKey: string
  fileType: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface DocumentLinkResponse {
  id: number
  documentId: number
  entityType: DocumentEntityType
  entityId: number
  createdAt: string
}

export interface EntityOption {
  id: number
  title: string
  type: DocumentEntityType
  status?: string
  date?: string
}
