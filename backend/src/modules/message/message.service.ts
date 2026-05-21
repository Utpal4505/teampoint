import { prisma } from '../../config/db.config.js'
import { DiscussionStatus, MessageType } from '../../generated/prisma/index.js'
import type { Prisma } from '../../generated/prisma/index.js'
import type {
  CreateMessageDTO,
  CreateMessageInput,
  DeleteMessageDTO,
  ListMessageDTO,
  UpdateMessageDTO,
} from '../../types/message.type.js'
import { ApiError } from '../../utils/apiError.js'
import { trackPosthogEvent } from '../../utils/posthog.js'
import { assertProjectMember } from '../../utils/assertProjectMember.js'
import { ensureExists } from '../../utils/ensureExists.js'
import { getWorkspaceIdFromProject } from '../../utils/getWorkspaceIdFromProject.js'
import { resolveProjectPermission } from '../../utils/resolveProjectPermission.js'
import type {
  ProjectPermissionMap,
  ProjectPermissionOverride,
} from '../../types/project.type.js'
import { emitToDiscussionRoom, emitToProjectRoom } from '../../services/socket.service.js'

const messageSelect = {
  id: true,
  discussionId: true,
  content: true,
  type: true,
  parentMessageId: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
    },
  },
} as const

const assertProjectPermission = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  userId: number,
  permission: keyof ProjectPermissionMap,
) => {
  const membership = await assertProjectMember(projectId, userId, tx)
  const overrides = membership.permissions as ProjectPermissionOverride | null
  const allowed = resolveProjectPermission(membership.role, overrides, permission)

  if (!allowed) {
    throw new ApiError(403, 'Permission denied')
  }
}

const mapMessage = (
  message: Prisma.MessageGetPayload<{ select: typeof messageSelect }>,
) => ({
  id: message.id,
  discussionId: message.discussionId,
  content: message.content,
  type: message.type,
  parentMessageId: message.parentMessageId,
  isDeleted: message.isDeleted,
  createdAt: message.createdAt,
  updatedAt: message.updatedAt,
  createdBy: {
    id: message.author.id,
    fullName: message.author.fullName,
    avatarUrl: message.author.avatarUrl,
  },
})

const getDiscussionOrThrow = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  discussionId: number,
) => {
  const discussion = await tx.discussion.findFirst({
    where: {
      id: discussionId,
      projectId,
    },
    select: {
      id: true,
      title: true,
      projectId: true,
      createdBy: true,
      status: true,
    },
  })

  ensureExists(discussion, 'Discussion')
  return discussion
}

const assertDecisionPermission = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  discussionCreatorId: number,
  userId: number,
) => {
  if (discussionCreatorId === userId) return

  await assertProjectPermission(tx, projectId, userId, 'canEditAnyDiscussion')
}

export const listMessagesService = async (
  projectId: number,
  discussionId: number,
  userId: number,
): Promise<ListMessageDTO> => {
  await assertProjectMember(projectId, userId)
  await prisma.$transaction(tx => getDiscussionOrThrow(tx, projectId, discussionId))

  const messages = await prisma.message.findMany({
    where: {
      discussionId,
      isDeleted: false,
    },
    select: messageSelect,
    orderBy: {
      createdAt: 'asc',
    },
  })

  return messages.map(mapMessage)
}

export const createMessageService = async (
  input: CreateMessageInput,
  userId: number,
): Promise<CreateMessageDTO> => {
  return prisma.$transaction(async tx => {
    await assertProjectMember(input.projectId, userId, tx)
    await assertProjectPermission(tx, input.projectId, userId, 'canComment')

    const discussion = await getDiscussionOrThrow(tx, input.projectId, input.discussionId)

    if (discussion.status === DiscussionStatus.CLOSED) {
      throw new ApiError(400, 'Messages can only be added to open discussions')
    }

    if (input.type === MessageType.DECISION) {
      await assertDecisionPermission(tx, input.projectId, discussion.createdBy, userId)
    }

    if (input.parentMessageId) {
      const parentMessage = await tx.message.findFirst({
        where: {
          id: input.parentMessageId,
          discussionId: input.discussionId,
          isDeleted: false,
        },
        select: {
          id: true,
        },
      })

      if (!parentMessage) {
        throw new ApiError(404, 'Parent message not found')
      }
    }

    const message = await tx.message.create({
      data: {
        discussionId: input.discussionId,
        createdBy: userId,
        content: input.content,
        type: input.type ?? MessageType.NORMAL,
        parentMessageId: input.parentMessageId ?? null,
      },
      select: messageSelect,
    })

    const workspaceId = await getWorkspaceIdFromProject(input.projectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'CREATED',
        entityType: 'COMMENT',
        entityId: message.id,
        actorId: userId,
        workspaceId,
        projectId: input.projectId,
        content: `A new message was added to discussion "${discussion.title}"`,
      },
    })

    const payload = mapMessage(message)

    emitToDiscussionRoom(input.discussionId, 'message:created', payload)
    emitToProjectRoom(input.projectId, 'discussion:message-created', payload)

    trackPosthogEvent(userId, 'message_sent', {
      discussion_id: input.discussionId,
      project_id: input.projectId,
      message_type: input.type ?? MessageType.NORMAL,
    })

    return payload
  })
}

export const deleteMessageService = async (
  projectId: number,
  discussionId: number,
  messageId: number,
  userId: number,
): Promise<DeleteMessageDTO> => {
  return prisma.$transaction(async tx => {
    await assertProjectMember(projectId, userId, tx)
    await getDiscussionOrThrow(tx, projectId, discussionId)

    const message = await tx.message.findFirst({
      where: {
        id: messageId,
        discussionId,
      },
      select: {
        id: true,
        discussionId: true,
        createdBy: true,
        isDeleted: true,
      },
    })

    ensureExists(message, 'Message')

    if (message.isDeleted) {
      throw new ApiError(400, 'Message is already deleted')
    }

    if (message.createdBy !== userId) {
      await assertProjectPermission(tx, projectId, userId, 'canDeleteAnyComment')
    }

    const updated = await tx.message.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        content: '[deleted]',
      },
      select: {
        id: true,
        isDeleted: true,
        updatedAt: true,
      },
    })

    const workspaceId = await getWorkspaceIdFromProject(projectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'DELETED',
        entityType: 'COMMENT',
        entityId: messageId,
        actorId: userId,
        workspaceId,
        projectId,
        content: 'A discussion message was deleted',
      },
    })

    emitToDiscussionRoom(discussionId, 'message:deleted', {
      id: updated.id,
      discussionId,
      isDeleted: updated.isDeleted,
      updatedAt: updated.updatedAt,
    })
    emitToProjectRoom(projectId, 'discussion:message-deleted', {
      id: updated.id,
      discussionId,
      isDeleted: updated.isDeleted,
      updatedAt: updated.updatedAt,
    })

    return {
      id: updated.id,
      discussionId,
      isDeleted: updated.isDeleted,
      updatedAt: updated.updatedAt,
    }
  })
}

export const updateMessageService = async (
  projectId: number,
  discussionId: number,
  messageId: number,
  content: string,
  userId: number,
): Promise<UpdateMessageDTO> => {
  return prisma.$transaction(async tx => {
    await assertProjectMember(projectId, userId, tx)
    await getDiscussionOrThrow(tx, projectId, discussionId)

    const message = await tx.message.findFirst({
      where: {
        id: messageId,
        discussionId,
      },
      select: {
        id: true,
        discussionId: true,
        createdBy: true,
        isDeleted: true,
      },
    })

    ensureExists(message, 'Message')

    if (message.isDeleted) {
      throw new ApiError(400, 'Cannot edit a deleted message')
    }

    if (message.createdBy !== userId) {
      await assertProjectPermission(tx, projectId, userId, 'canEditAnyComment')
    }

    const updated = await tx.message.update({
      where: { id: messageId },
      data: {
        content,
      },
      select: {
        id: true,
        discussionId: true,
        content: true,
        updatedAt: true,
      },
    })

    const workspaceId = await getWorkspaceIdFromProject(projectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'UPDATED',
        entityType: 'COMMENT',
        entityId: messageId,
        actorId: userId,
        workspaceId,
        projectId,
        content: 'A discussion message was edited',
      },
    })

    emitToDiscussionRoom(discussionId, 'message:updated', {
      id: updated.id,
      discussionId: updated.discussionId,
      content: updated.content,
      updatedAt: updated.updatedAt,
    })
    emitToProjectRoom(projectId, 'discussion:message-updated', {
      id: updated.id,
      discussionId: updated.discussionId,
      content: updated.content,
      updatedAt: updated.updatedAt,
    })

    return {
      id: updated.id,
      discussionId: updated.discussionId,
      content: updated.content,
      updatedAt: updated.updatedAt,
    }
  })
}
