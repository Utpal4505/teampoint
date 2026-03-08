import { prisma } from '../../config/db.config.ts'
import type { WorkspaceRole } from '../../generated/prisma/enums.ts'
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
} from '../../types/workspace.types.ts'
import { ApiError } from '../../utils/apiError.ts'
import { handlePrismaNotFound } from '../../utils/handlePrismaNotFound.ts'
import { createActivityLog } from '../activityLog/activityLog.service.ts'
import { ROLE_PERMISSIONS } from './workspace.permissions.ts'

export const createWorkspaceService = async (
  input: CreateWorkspaceInput,
): Promise<WorkspaceDTO> => {
  const { name, description, ownerId } = input

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
        // TODO: paginate or limit members if workspace grows large
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
}: {
  workspaceId: number
}): Promise<ListAllWorkspacesMemberDTO> => {
  const members = await prisma.workspace_Members.findMany({
    where: {
      workspaceId,
    },
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
  })

  return members
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
}: {
  userId: number
}): Promise<ListUserWorkspacesDTO> => {
  if (!userId) {
    throw new ApiError(400, 'User ID is required')
  }

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