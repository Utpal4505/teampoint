import { prisma } from '../../config/db.config.js'
import type { WorkspaceRole } from '../../generated/prisma/index.js'
import type {
  ArchiveWorkspaceDTO,
  CreateWorkspaceInput,
  DeleteWorkspaceDTO,
  GetWorkspaceDTO,
  ListAllWorkspacesMemberDTO,
  ListUserWorkspacesDTO,
  RemoveorUpdateWorkspaceMemberDTO,
  updateWorkspaceDTO,
  UpdateWorkspaceInput,
  WorkspaceDTO,
} from '../../types/workspace.types.js'
import { ApiError } from '../../utils/apiError.js'
import { handlePrismaNotFound } from '../../utils/handlePrismaNotFound.js'
import { trackPosthogEvent } from '../../utils/posthog.js'
import { createActivityLog } from '../activityLog/activityLog.service.js'
import { ROLE_PERMISSIONS } from './workspace.permissions.js'

export const createWorkspaceService = async (
  input: CreateWorkspaceInput,
): Promise<WorkspaceDTO> => {
  const { name, description, ownerId } = input

  const existingWs = await prisma.workspace.findMany({
    where: {
      createdBy: ownerId,
    },
  })

  if (existingWs.length >= 3) {
    throw new ApiError(400, 'You can only create up to 3 workspaces.')
  }

  const workspace = await prisma.$transaction(async tx => {
    const ws = await tx.workspace.create({
      data: {
        name,
        description: description ?? null,
        createdBy: ownerId,
        status: 'ACTIVE',
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
      },
    })

    await tx.workspace_Members.create({
      data: {
        userId: ownerId,
        role: 'OWNER',
        workspaceId: ws.id,
        joinedAt: new Date(),
        permissions: ROLE_PERMISSIONS.OWNER,
      },
    })

    return ws
  })

  trackPosthogEvent(ownerId, 'workspace_created', {
    workspace_id: workspace.id,
    workspace_name: workspace.name,
  })

  return workspace
}

export const getWorkspaceByIdService = async (
  workspaceId: number,
): Promise<GetWorkspaceDTO> => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdBy: true,
      workspaceMembers: {
        select: {
          role: true,
          joinedAt: true,
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        take: 20,
      },
      createdAt: true,
    },
  })

  if (!workspace || workspace.status === 'DELETED') {
    throw new ApiError(404, 'Workspace not found')
  }

  return workspace
}

export const updateWorkspaceService = async ({
  workspaceId,
  name,
  description,
}: UpdateWorkspaceInput): Promise<updateWorkspaceDTO> => {
  const updateData: {
    name?: string
    description?: string | null
    updatedAt?: Date
  } = {}

  if (name) updateData.name = name.trim()
  if (description !== undefined) updateData.description = description
  updateData.updatedAt = new Date()

  if (!name && description === undefined) {
    throw new ApiError(400, 'No fields to update')
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      status: 'ACTIVE',
    },
  })

  if (!workspace) {
    throw new ApiError(404, 'Workspace not found')
  }

  return prisma.workspace.update({
    where: { id: workspaceId },
    data: updateData,
  })
}

export const archiveWorkspaceService = async ({
  workspaceId,
}: {
  workspaceId: number
}): Promise<ArchiveWorkspaceDTO> => {
  return handlePrismaNotFound(
    prisma.workspace.update({
      where: {
        id: workspaceId,
        status: 'ACTIVE',
      },
      data: {
        status: 'ARCHIVED',
        archivedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        archivedAt: true,
      },
    }),
    'Workspace not found',
  )
}

export const deleteWorkspaceService = async ({
  workspaceId,
}: {
  workspaceId: number
}): Promise<DeleteWorkspaceDTO> => {
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      status: {
        in: ['ACTIVE', 'ARCHIVED'],
      },
    },
  })

  if (!workspace) {
    throw new ApiError(404, 'Workspace not found or cannot be deleted')
  }

  return handlePrismaNotFound(
    prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
      },
      select: {
        id: true,
        status: true,
        deletedAt: true,
      },
    }),
    'Workspace not found',
  )
}

export const listAllWorkspaceMembersService = async ({
  workspaceId,
  page = 1,
  limit = 50,
}: {
  workspaceId: number
  page?: number
  limit?: number
}): Promise<ListAllWorkspacesMemberDTO> => {
  const skip = (page - 1) * limit

  const [members, total] = await Promise.all([
    prisma.workspace_Members.findMany({
      where: { workspaceId },
      select: {
        role: true,
        joinedAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            status: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { joinedAt: 'asc' },
    }),
    prisma.workspace_Members.count({ where: { workspaceId } }),
  ])

  return {
    members,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export const removeWorkspaceMemberService = async ({
  workspaceId,
  targetUserId,
  actorId,
}: {
  workspaceId: number
  targetUserId: number
  actorId: number
}): Promise<RemoveorUpdateWorkspaceMemberDTO> => {
  return prisma.$transaction(async tx => {
    const member = await tx.workspace_Members.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUserId,
        },
      },
      select: {
        status: true,
        role: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    if (!member || member.status !== 'ACTIVE') {
      throw new ApiError(404, 'Member not found')
    }

    if (member.role === 'OWNER') {
      throw new ApiError(400, 'Owner cannot be removed')
    }

    const updatedMember = await tx.workspace_Members.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUserId,
        },
      },
      data: {
        status: 'REMOVED',
      },
      select: {
        userId: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    })

    await createActivityLog(tx, {
      entityType: 'WORKSPACE_MEMBER',
      entityId: targetUserId,
      action: 'REMOVED',
      actorId,
      workspaceId,
      content: `User ${member.user.fullName} was removed from the workspace`,
    })

    return updatedMember
  })
}

export const updateWorkspaceMemberRoleService = async ({
  workspaceId,
  actorId,
  targetUserId,
  role,
}: {
  workspaceId: number
  targetUserId: number
  role: WorkspaceRole
  actorId: number
}): Promise<RemoveorUpdateWorkspaceMemberDTO> => {
  return prisma.$transaction(async tx => {
    const member = await tx.workspace_Members.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUserId,
        },
      },
      select: {
        status: true,
        role: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    })

    if (!member || member.status !== 'ACTIVE') {
      throw new ApiError(404, 'Member not found')
    }

    if (member.role === 'OWNER') {
      throw new ApiError(400, 'Owner role cannot be updated')
    }

    const updatedMember = await tx.workspace_Members.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUserId,
        },
      },
      data: {
        role,
        permissions: ROLE_PERMISSIONS[role],
      },
      select: {
        userId: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    })

    await createActivityLog(tx, {
      entityType: 'WORKSPACE_MEMBER',
      entityId: targetUserId,
      action: 'UPDATED',
      actorId: actorId,
      workspaceId,
      content: `User ${member.user.fullName}'s role was updated to ${role}`,
    })

    return updatedMember
  })
}

export const listUserWorkspacesService = async ({
  userId,
  page = 1,
  limit = 20,
}: {
  userId: number
  page?: number
  limit?: number
}): Promise<ListUserWorkspacesDTO> => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required')
  }

  const safePage = Math.max(1, page)
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const skip = (safePage - 1) * safeLimit

  const memberships = await prisma.workspace_Members.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      workspace: {
        status: {
          in: ['ACTIVE', 'ARCHIVED'],
        },
      },
    },
    select: {
      role: true,
      joinedAt: true,
      workspace: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          createdAt: true,
        },
      },
    },
    skip,
    take: safeLimit,
    orderBy: {
      joinedAt: 'desc',
    },
  })

  if (!memberships || memberships.length === 0) {
    return []
  }

  return memberships.map(member => ({
    id: member.workspace.id,
    name: member.workspace.name,
    description: member.workspace.description,
    status: member.workspace.status,
    role: member.role,
    joinedAt: member.joinedAt,
    createdAt: member.workspace.createdAt,
  }))
}
