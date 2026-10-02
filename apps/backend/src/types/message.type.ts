import type z from 'zod'
import type { MessageType } from '../generated/prisma/index.js'
import type { createMessageSchema } from '../modules/message/message.schema.js'

export type CreateMessageInput = z.infer<typeof createMessageSchema> & {
  projectId: number
  discussionId: number
}

export type MessageItem = {
  id: number
  discussionId: number
  content: string
  type: MessageType
  parentMessageId: number | null
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  createdBy: {
    id: number
    fullName: string
    avatarUrl: string | null
  }
}

export type ListMessageDTO = {
  items: MessageItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type CreateMessageDTO = MessageItem

export type DeleteMessageDTO = {
  id: number
  discussionId: number
  isDeleted: boolean
  updatedAt: Date
}

export type UpdateMessageDTO = {
  id: number
  discussionId: number
  content: string
  updatedAt: Date
}