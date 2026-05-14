import api from '@/lib/api'
import type {
  CreateDiscussionInput,
  CreateMessageInput,
  Discussion,
  DiscussionFilters,
  Message,
  UpdateDiscussionInput,
} from './types'

export const listDiscussions = async (
  projectId: number,
  filters?: DiscussionFilters,
): Promise<Discussion[]> => {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.type) params.set('type', filters.type)
  if (filters?.contextId) params.set('contextId', String(filters.contextId))
  if (filters?.includeClosed) params.set('includeClosed', 'true')

  const query = params.toString()
  const { data } = await api.get(
    `/projects/${projectId}/discussions${query ? `?${query}` : ''}`,
  )

  return data.data ?? []
}

export const getDiscussion = async (
  projectId: number,
  discussionId: number,
): Promise<Discussion> => {
  const { data } = await api.get(`/projects/${projectId}/discussions/${discussionId}`)
  return data.data
}

export const createDiscussion = async (
  projectId: number,
  input: CreateDiscussionInput,
): Promise<Discussion> => {
  const { data } = await api.post(`/projects/${projectId}/discussions`, input)
  return data.data
}

export const updateDiscussion = async (
  projectId: number,
  discussionId: number,
  input: UpdateDiscussionInput,
): Promise<Discussion> => {
  const { data } = await api.patch(
    `/projects/${projectId}/discussions/${discussionId}`,
    input,
  )
  return data.data
}

export const closeDiscussion = async (
  projectId: number,
  discussionId: number,
): Promise<{ id: number; status: 'CLOSED'; closedAt: string }> => {
  const { data } = await api.post(
    `/projects/${projectId}/discussions/${discussionId}/close`,
    {},
  )
  return data.data
}

export const reopenDiscussion = async (
  projectId: number,
  discussionId: number,
): Promise<{ id: number; status: 'OPEN'; closedAt: null; updatedAt: string }> => {
  const { data } = await api.post(
    `/projects/${projectId}/discussions/${discussionId}/reopen`,
    {},
  )
  return data.data
}

export const deleteDiscussion = async (
  projectId: number,
  discussionId: number,
): Promise<{ id: number; deleted: true }> => {
  const { data } = await api.delete(
    `/projects/${projectId}/discussions/${discussionId}`,
  )
  return data.data
}

export const listMessages = async (
  projectId: number,
  discussionId: number,
): Promise<Message[]> => {
  const { data } = await api.get(
    `/projects/${projectId}/discussions/${discussionId}/messages`,
  )
  return data.data ?? []
}

export const createMessage = async (
  projectId: number,
  discussionId: number,
  input: CreateMessageInput,
): Promise<Message> => {
  const { data } = await api.post(
    `/projects/${projectId}/discussions/${discussionId}/messages`,
    input,
  )
  return data.data
}

export const updateMessage = async (
  projectId: number,
  discussionId: number,
  messageId: number,
  input: { content: string },
): Promise<{ id: number; discussionId: number; content: string; updatedAt: string }> => {
  const { data } = await api.patch(
    `/projects/${projectId}/discussions/${discussionId}/messages/${messageId}`,
    input,
  )
  return data.data
}

export const deleteMessage = async (
  projectId: number,
  discussionId: number,
  messageId: number,
): Promise<{ id: number; discussionId: number; isDeleted: boolean; updatedAt: string }> => {
  const { data } = await api.delete(
    `/projects/${projectId}/discussions/${discussionId}/messages/${messageId}`,
  )
  return data.data
}
