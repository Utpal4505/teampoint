import { prisma } from '../../config/db.config.js'
import { DiscussionStatus, DiscussionType } from '../../generated/prisma/index.js'
import type { Prisma } from '../../generated/prisma/index.js'
import type {
  CloseDiscussionDTO,
  CreateDiscussionDTO,
  CreateDiscussionInput,
  DeleteDiscussionDTO,
  GetDiscussionDTO,
  ListDiscussionDTO,
  ListDiscussionsQuery,
  ReopenDiscussionDTO,
  UpdateDiscussionDTO,
  UpdateDiscussionInput,
} from '../../types/discussion.type.js'
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

const discussionSelect = {
  id: true,
  projectId: true,
  title: true,
  description: true,
  type: true,
  contextId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  closedAt: true,
  creator: {
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
    },
  },
  _count: {
    select: {
      messages: {
        where: {
          isDeleted: false,
        },
      },
    },
  },
} as const

const assertDiscussionPermission = async (
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

const assertDiscussionOwnerOrPermission = async (
  tx: Prisma.TransactionClient,
  projectId: number,
  discussionCreatorId: number,
  userId: number,
  permission: keyof ProjectPermissionMap,
) => {
  if (discussionCreatorId === userId) {
    await assertProjectMember(projectId, userId, tx)
    return
  }

  await assertDiscussionPermission(tx, projectId, userId, permission)
}

const assertDiscussionContext = async (
  tx: Prisma.TransactionClient,
  input: Pick<CreateDiscussionInput, 'projectId' | 'type' | 'contextId'>,
) => {
  if (input.type !== DiscussionType.TASK) {
    return null
  }

  if (!input.contextId) {
    throw new ApiError(400, 'Task discussions require a contextId')
  }

  const task = await tx.tasks.findFirst({
    where: {
      id: input.contextId,
      projectId: input.projectId,
    },
    select: {
      id: true,
    },
  })

  if (!task) {
    throw new ApiError(404, 'Task not found for this project')
  }

  return task.id
}

const mapDiscussion = (
  discussion: Prisma.DiscussionGetPayload<{ select: typeof discussionSelect }>,
) => ({
  id: discussion.id,
  projectId: discussion.projectId,
  title: discussion.title,
  description: discussion.description,
  type: discussion.type,
  contextId: discussion.contextId,
  status: discussion.status,
  createdAt: discussion.createdAt,
  updatedAt: discussion.updatedAt,
  closedAt: discussion.closedAt,
  createdBy: {
    id: discussion.creator.id,
    fullName: discussion.creator.fullName,
    avatarUrl: discussion.creator.avatarUrl,
  },
  messageCount: discussion._count.messages,
})

export const createDiscussionService = async (
  input: CreateDiscussionInput,
  userId: number,
): Promise<CreateDiscussionDTO> => {
  return prisma.$transaction(async tx => {
    await assertProjectMember(input.projectId, userId, tx)
    const contextId = await assertDiscussionContext(tx, input)

    const discussion = await tx.discussion.create({
      data: {
        projectId: input.projectId,
        createdBy: userId,
        title: input.title,
        description: input.description ?? null,
        status: DiscussionStatus.OPEN,
        type: input.type,
        contextId,
      },
      select: discussionSelect,
    })

    const workspaceId = await getWorkspaceIdFromProject(input.projectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'CREATED',
        entityType: 'DISCUSSION',
        entityId: discussion.id,
        actorId: userId,
        workspaceId,
        projectId: input.projectId,
        content: `Discussion "${discussion.title}" was created by ${discussion.creator.fullName}`,
      },
    })

    const payload = mapDiscussion(discussion)
    emitToProjectRoom(input.projectId, 'discussion:created', payload)

    trackPosthogEvent(userId, 'discussion_created', {
      discussion_id: discussion.id,
      project_id: input.projectId,
      discussion_type: discussion.type,
    })

    return payload
  })
}

export const listDiscussionsService = async (
  projectId: number,
  userId: number,
  filters: ListDiscussionsQuery,
): Promise<ListDiscussionDTO> => {
  await assertProjectMember(projectId, userId)

  const discussions = await prisma.discussion.findMany({
    where: {
      projectId,
      ...(filters.status
        ? { status: filters.status }
        : filters.includeClosed
          ? {}
          : { status: { not: DiscussionStatus.CLOSED } }),
      ...(filters.createdBy ? { createdBy: filters.createdBy } : {}),
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.contextId ? { contextId: filters.contextId } : {}),
    },
    select: discussionSelect,
    orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
  })

  return discussions.map(mapDiscussion)
}

export const getDiscussionByIdService = async (
  projectId: number,
  discussionId: number,
  userId: number,
): Promise<GetDiscussionDTO> => {
  await assertProjectMember(projectId, userId)

  const discussion = await prisma.discussion.findFirst({
    where: {
      id: discussionId,
      projectId,
    },
    select: {
      ...discussionSelect,
    },
  })

  ensureExists(discussion, 'Discussion')

  return {
    ...mapDiscussion(discussion),
  }
}

export const updateDiscussionService = async (
  input: UpdateDiscussionInput,
  userId: number,
): Promise<UpdateDiscussionDTO> => {
  return prisma.$transaction(async tx => {
    const discussion = await tx.discussion.findFirst({
      where: {
        id: input.discussionId,
        projectId: input.projectId,
      },
      select: {
        id: true,
        projectId: true,
        createdBy: true,
      },
    })

    ensureExists(discussion, 'Discussion')

    await assertProjectMember(input.projectId, userId, tx)

    if (discussion.createdBy !== userId) {
      await assertDiscussionPermission(
        tx,
        input.projectId,
        userId,
        'canEditAnyDiscussion',
      )
    }

    const updated = await tx.discussion.update({
      where: { id: discussion.id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description ?? null }
          : {}),
      },
      select: discussionSelect,
    })

    const workspaceId = await getWorkspaceIdFromProject(input.projectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'UPDATED',
        entityType: 'DISCUSSION',
        entityId: updated.id,
        actorId: userId,
        workspaceId,
        projectId: input.projectId,
        content: `Discussion "${updated.title}" was updated by ${updated.creator.fullName}`,
      },
    })

    const payload = mapDiscussion(updated)
    emitToProjectRoom(input.projectId, 'discussion:updated', payload)
    emitToDiscussionRoom(input.discussionId, 'discussion:updated', payload)

    return payload
  })
}

export const closeDiscussionService = async (
  projectId: number,
  discussionId: number,
  userId: number,
): Promise<CloseDiscussionDTO> => {
  return prisma.$transaction(async tx => {
    const discussion = await tx.discussion.findFirst({
      where: {
        id: discussionId,
        projectId,
      },
      select: {
        id: true,
        title: true,
        createdBy: true,
        status: true,
      },
    })

    ensureExists(discussion, 'Discussion')

    if (discussion.status === DiscussionStatus.CLOSED) {
      throw new ApiError(400, 'Discussion is already closed')
    }

    await assertDiscussionOwnerOrPermission(
      tx,
      projectId,
      discussion.createdBy,
      userId,
      'canCloseDiscussions',
    )

    const closedAt = new Date()

    const updated = await tx.discussion.update({
      where: { id: discussionId },
      data: {
        status: DiscussionStatus.CLOSED,
        closedAt,
      },
      select: discussionSelect,
    })

    const workspaceId = await getWorkspaceIdFromProject(projectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'COMPLETED',
        entityType: 'DISCUSSION',
        entityId: discussionId,
        actorId: userId,
        workspaceId,
        projectId,
        content: `Discussion "${discussion.title}" was closed`,
      },
    })

    const payload = mapDiscussion(updated)
    emitToProjectRoom(projectId, 'discussion:closed', payload)
    emitToDiscussionRoom(discussionId, 'discussion:closed', payload)

    return {
      id: updated.id,
      status: DiscussionStatus.CLOSED,
      closedAt: updated.closedAt!,
    }
  })
}

export const reopenDiscussionService = async (
  projectId: number,
  discussionId: number,
  userId: number,
): Promise<ReopenDiscussionDTO> => {
  return prisma.$transaction(async tx => {
    const discussion = await tx.discussion.findFirst({
      where: {
        id: discussionId,
        projectId,
      },
      select: {
        id: true,
        title: true,
        createdBy: true,
        status: true,
      },
    })

    ensureExists(discussion, 'Discussion')

    if (discussion.status === DiscussionStatus.OPEN) {
      throw new ApiError(400, 'Discussion is already open')
    }

    await assertDiscussionOwnerOrPermission(
      tx,
      projectId,
      discussion.createdBy,
      userId,
      'canReopenDiscussions',
    )

    const updated = await tx.discussion.update({
      where: { id: discussionId },
      data: {
        status: DiscussionStatus.OPEN,
        closedAt: null,
      },
      select: discussionSelect,
    })

    const workspaceId = await getWorkspaceIdFromProject(projectId, userId, tx)

    await tx.activityLog.create({
      data: {
        action: 'UPDATED',
        entityType: 'DISCUSSION',
        entityId: discussionId,
        actorId: userId,
        workspaceId,
        projectId,
        content: `Discussion "${discussion.title}" was reopened`,
      },
    })

    const payload = mapDiscussion(updated)
    emitToProjectRoom(projectId, 'discussion:reopened', payload)
    emitToDiscussionRoom(discussionId, 'discussion:reopened', payload)

    return {
      id: updated.id,
      status: DiscussionStatus.OPEN,
      closedAt: null,
      updatedAt: updated.updatedAt,
    }
  })
}

export const deleteDiscussionService = async (
  projectId: number,
  discussionId: number,
  userId: number,
): Promise<DeleteDiscussionDTO> => {
  return prisma.$transaction(async tx => {
    const discussion = await tx.discussion.findFirst({
      where: {
        id: discussionId,
        projectId,
      },
      select: {
        id: true,
        title: true,
        createdBy: true,
      },
    })

    ensureExists(discussion, 'Discussion')

    await assertDiscussionOwnerOrPermission(
      tx,
      projectId,
      discussion.createdBy,
      userId,
      'canEditAnyDiscussion',
    )

    const workspaceId = await getWorkspaceIdFromProject(projectId, userId, tx)

    await tx.message.deleteMany({
      where: {
        discussionId,
      },
    })

    await tx.documentLink.updateMany({
      where: {
        entityType: 'DISCUSSION',
        entityId: discussionId,
        status: 'LINKED',
      },
      data: {
        status: 'UNLINKED',
        unlinkedAt: new Date(),
      },
    })

    await tx.discussion.delete({
      where: {
        id: discussionId,
      },
    })

    await tx.activityLog.create({
      data: {
        action: 'DELETED',
        entityType: 'DISCUSSION',
        entityId: discussionId,
        actorId: userId,
        workspaceId,
        projectId,
        content: `Discussion "${discussion.title}" was deleted`,
      },
    })

    emitToProjectRoom(projectId, 'discussion:deleted', { id: discussionId })
    emitToDiscussionRoom(discussionId, 'discussion:deleted', { id: discussionId })

    return {
      id: discussionId,
      deleted: true,
    }
  })
}
