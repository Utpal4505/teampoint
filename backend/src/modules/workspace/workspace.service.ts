import { prisma } from '../../config/db.config.ts'
import type {
  ArchiveWorkspaceDTO,
  CreateWorkspaceInput,
  DeleteWorkspaceDTO,
  GetWorkspaceDTO,
  ListAllWorkspacesMemberDTO,
  RemoveWorkspaceMemberDTO,
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
              avatar_url: true,
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

  if (Object.keys(updateData).length === 1 && updateData.updatedAt) {
    throw new ApiError(400, 'No fields to update')
  }
  return handlePrismaNotFound(
    prisma.workspace.update({
      where: {
        id: workspaceId,
        status: 'ACTIVE',
      },
      data: {
        ...updateData,
      },
      select: {
        id: true,
        name: true,
        description: true,
        updatedAt: true,
      },
    }),
    'Workspace not found',
  )
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
  return handlePrismaNotFound(
    prisma.workspace.update({
      where: {
        id: workspaceId,
        status: {
          in: ['ACTIVE', 'ARCHIVED'],
        },
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
          avatar_url: true,
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
}): Promise<RemoveWorkspaceMemberDTO> => {
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