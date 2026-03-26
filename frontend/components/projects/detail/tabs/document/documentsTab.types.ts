export type DocumentFilter = 'ALL' | 'LINKED' | 'UNLINKED' | 'ARCHIVED'

export type LinkEntityType = 'TASK' | 'DISCUSSION' | 'MILESTONE' | 'MEETING'

export interface DocumentLink {
  id: number
  entityType: LinkEntityType
  entityId: number
  createdAt: string
}

export interface DocumentWithLinks {
  id: number
  title: string
  description: string | null
  fileType: string
  uploaderName?: string
  uploadedBy?: number
  isArchived: boolean
  createdAt: string
  links: DocumentLink[]
}
