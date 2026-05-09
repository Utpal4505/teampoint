export type DiscussionStatus = 'OPEN' | 'CLOSED'
export type DiscussionType = 'GENERAL' | 'TASK'
export type MessageType = 'NORMAL' | 'DECISION'

export interface DiscussionUser {
  id: number
  fullName: string
  avatarUrl: string | null
}

export interface Discussion {
  id: number
  projectId: number
  title: string
  description: string | null
  type: DiscussionType
  contextId: number | null
  status: DiscussionStatus
  createdAt: string
  updatedAt: string
  closedAt: string | null
  createdBy: DiscussionUser
  messageCount: number
}

export interface CreateDiscussionInput {
  title: string
  description?: string
  type: DiscussionType
  contextId?: number
}

export interface UpdateDiscussionInput {
  title?: string
  description?: string
}

export interface Message {
  id: number
  discussionId: number
  content: string
  type: MessageType
  parentMessageId: number | null
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  createdBy: DiscussionUser
}

export interface CreateMessageInput {
  content: string
  type?: MessageType
  parentMessageId?: number
}
