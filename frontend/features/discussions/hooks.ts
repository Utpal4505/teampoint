import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { handleApiError } from '@/lib/handle-api-error'
import { useSocket } from '@/hooks/use-socket'
import {
  closeDiscussion,
  createDiscussion,
  createMessage,
  deleteDiscussion,
  deleteMessage,
  getDiscussion,
  listDiscussions,
  listMessages,
  reopenDiscussion,
  updateDiscussion,
  updateMessage,
} from './api'
import type {
  CreateDiscussionInput,
  CreateMessageInput,
  Discussion,
  DiscussionFilters,
  Message,
  UpdateDiscussionInput,
} from './types'

export const discussionKeys = {
  all: ['discussions'] as const,
  lists: (projectId: number) => [...discussionKeys.all, 'project', projectId] as const,
  list: (projectId: number, filters?: DiscussionFilters) =>
    [
      ...discussionKeys.lists(projectId),
      {
        status: filters?.status ?? 'ALL',
        type: filters?.type ?? 'ALL',
        contextId: filters?.contextId ?? 'ALL',
        includeClosed: filters?.includeClosed ?? false,
      },
    ] as const,
  detail: (projectId: number, discussionId: number) =>
    [...discussionKeys.lists(projectId), 'detail', discussionId] as const,
  messages: (projectId: number, discussionId: number) =>
    [...discussionKeys.detail(projectId, discussionId), 'messages'] as const,
}

export const useProjectDiscussions = (projectId: number, filters?: DiscussionFilters) =>
  useQuery({
    queryKey: discussionKeys.list(projectId, filters),
    queryFn: () => listDiscussions(projectId, filters),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 2,
  })

export const useDiscussion = (projectId: number, discussionId: number) =>
  useQuery({
    queryKey: discussionKeys.detail(projectId, discussionId),
    queryFn: () => getDiscussion(projectId, discussionId),
    enabled: !!projectId && !!discussionId,
    staleTime: 1000 * 60 * 2,
  })

export const useDiscussionMessages = (projectId: number, discussionId: number) =>
  useQuery({
    queryKey: discussionKeys.messages(projectId, discussionId),
    queryFn: () => listMessages(projectId, discussionId),
    enabled: !!projectId && !!discussionId,
    staleTime: 1000 * 30,
  })

export const useCreateDiscussion = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateDiscussionInput) => createDiscussion(projectId, input),
    onSuccess: discussion => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists(projectId) })
      queryClient.setQueryData(
        discussionKeys.detail(projectId, discussion.id),
        discussion,
      )
    },
    onError: handleApiError,
  })
}

export const useUpdateDiscussion = (projectId: number, discussionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateDiscussionInput) =>
      updateDiscussion(projectId, discussionId, input),
    onSuccess: discussion => {
      queryClient.setQueryData(discussionKeys.detail(projectId, discussionId), discussion)
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists(projectId) })
    },
    onError: handleApiError,
  })
}

export const useCloseDiscussion = (projectId: number, discussionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => closeDiscussion(projectId, discussionId),
    onSuccess: data => {
      queryClient.setQueryData<Discussion>(
        discussionKeys.detail(projectId, discussionId),
        old =>
          old ? { ...old, status: data.status, closedAt: data.closedAt } : undefined,
      )
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists(projectId) })
    },
    onError: handleApiError,
  })
}

export const useReopenDiscussion = (projectId: number, discussionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => reopenDiscussion(projectId, discussionId),
    onSuccess: data => {
      queryClient.setQueryData<Discussion>(
        discussionKeys.detail(projectId, discussionId),
        old =>
          old
            ? {
                ...old,
                status: data.status,
                closedAt: data.closedAt,
                updatedAt: data.updatedAt,
              }
            : undefined,
      )
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists(projectId) })
    },
    onError: handleApiError,
  })
}

export const useDeleteDiscussion = (projectId: number, discussionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteDiscussion(projectId, discussionId),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: discussionKeys.detail(projectId, discussionId),
      })
      queryClient.removeQueries({
        queryKey: discussionKeys.messages(projectId, discussionId),
      })
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists(projectId) })
    },
    onError: handleApiError,
  })
}

export const useCreateMessage = (projectId: number, discussionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateMessageInput) =>
      createMessage(projectId, discussionId, input),
    onSuccess: message => {
      queryClient.setQueryData<Message[]>(
        discussionKeys.messages(projectId, discussionId),
        old =>
          old?.some(item => item.id === message.id) ? old : [...(old ?? []), message],
      )
    },
    onError: handleApiError,
  })
}

export const useUpdateMessage = (projectId: number, discussionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: number; content: string }) =>
      updateMessage(projectId, discussionId, messageId, { content }),
    onSuccess: updated => {
      queryClient.setQueryData<Message[]>(
        discussionKeys.messages(projectId, discussionId),
        old =>
          old?.map(message =>
            message.id === updated.id
              ? { ...message, content: updated.content, updatedAt: updated.updatedAt }
              : message,
          ),
      )
    },
    onError: handleApiError,
  })
}

export const useDeleteMessage = (projectId: number, discussionId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (messageId: number) => deleteMessage(projectId, discussionId, messageId),
    onSuccess: deleted => {
      queryClient.setQueryData<Message[]>(
        discussionKeys.messages(projectId, discussionId),
        old => old?.filter(message => message.id !== deleted.id),
      )
    },
    onError: handleApiError,
  })
}

export const useDiscussionSocketEvents = (projectId: number, discussionId?: number) => {
  const queryClient = useQueryClient()
  const socket = useSocket({ projectId, discussionId })

  useEffect(() => {
    if (!socket) return

    const refreshDiscussions = () => {
      queryClient.invalidateQueries({ queryKey: discussionKeys.lists(projectId) })
    }

    const upsertMessage = (message: Message) => {
      if (typeof discussionId !== 'number' || message.discussionId !== discussionId) {
        return
      }
      queryClient.setQueryData<Message[]>(
        discussionKeys.messages(projectId, discussionId),
        old =>
          old?.some(item => item.id === message.id)
            ? old.map(item => (item.id === message.id ? message : item))
            : [...(old ?? []), message],
      )
    }

    const updateMessageInCache = (message: Partial<Message> & { id: number }) => {
      if (typeof discussionId !== 'number' || message.discussionId !== discussionId) {
        return
      }
      queryClient.setQueryData<Message[]>(
        discussionKeys.messages(projectId, discussionId),
        old =>
          old?.map(item =>
            item.id === message.id
              ? {
                  ...item,
                  ...message,
                }
              : item,
          ),
      )
    }

    const removeMessage = (message: { id: number; discussionId: number }) => {
      if (typeof discussionId !== 'number' || message.discussionId !== discussionId) {
        return
      }
      queryClient.setQueryData<Message[]>(
        discussionKeys.messages(projectId, discussionId),
        old => old?.filter(item => item.id !== message.id),
      )
    }

    const updateDiscussionInCache = (discussion: Discussion) => {
      queryClient.setQueryData(
        discussionKeys.detail(projectId, discussion.id),
        discussion,
      )
      refreshDiscussions()
    }

    socket.on('discussion:created', refreshDiscussions)
    socket.on('discussion:message-created', refreshDiscussions)
    socket.on('discussion:message-deleted', refreshDiscussions)
    socket.on('discussion:updated', updateDiscussionInCache)
    socket.on('discussion:closed', updateDiscussionInCache)
    socket.on('discussion:reopened', updateDiscussionInCache)
    socket.on('discussion:deleted', refreshDiscussions)
    socket.on('message:created', upsertMessage)
    socket.on('message:updated', updateMessageInCache)
    socket.on('message:deleted', removeMessage)

    return () => {
      socket.off('discussion:created', refreshDiscussions)
      socket.off('discussion:message-created', refreshDiscussions)
      socket.off('discussion:message-deleted', refreshDiscussions)
      socket.off('discussion:updated', updateDiscussionInCache)
      socket.off('discussion:closed', updateDiscussionInCache)
      socket.off('discussion:reopened', updateDiscussionInCache)
      socket.off('discussion:deleted', refreshDiscussions)
      socket.off('message:created', upsertMessage)
      socket.off('message:updated', updateMessageInCache)
      socket.off('message:deleted', removeMessage)
    }
  }, [discussionId, projectId, queryClient, socket])
}
