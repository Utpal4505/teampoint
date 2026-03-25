export type DocumentFilter = 'ALL' | 'LINKED' | 'UNLINKED' | 'ARCHIVED'

export type LinkEntityType = 'TASK' | 'DISCUSSION' | 'MILESTONE'

export interface DocumentLink {
  id: number
  entityType: LinkEntityType
  entityId: number
  entityTitle: string
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
