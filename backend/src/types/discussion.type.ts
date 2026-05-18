import type z from 'zod'
import type {
  DiscussionStatus,
  DiscussionType,
} from '../generated/prisma/enums.js'
import type {
  createDiscussionSchema,
  listDiscussionsQuerySchema,
  updateDiscussionSchema,
} from '../modules/discussion/discussion.schema.js'

export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema> & {
  projectId: number
}

export type UpdateDiscussionInput = z.infer<typeof updateDiscussionSchema> & {
  projectId: number
  discussionId: number
}

export type ListDiscussionsQuery = z.infer<typeof listDiscussionsQuerySchema>

export type ReopenDiscussionInput = {
  projectId: number
  discussionId: number
}

export type DiscussionListItem = {
  id: number
  projectId: number
  title: string
  description: string | null
  type: DiscussionType
  contextId: number | null
  status: DiscussionStatus
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
  createdBy: {
    id: number
    fullName: string
    avatarUrl: string | null
  }
  messageCount: number
}

export type ListDiscussionDTO = DiscussionListItem[]

export type CreateDiscussionDTO = DiscussionListItem

export type GetDiscussionDTO = DiscussionListItem

export type UpdateDiscussionDTO = DiscussionListItem

export type CloseDiscussionDTO = {
  id: number
  status: 'CLOSED'
  closedAt: Date
}

export type ReopenDiscussionDTO = {
  id: number
  status: 'OPEN'
  closedAt: null
  updatedAt: Date
}

export type DeleteDiscussionDTO = {
  id: number
  deleted: true
}
