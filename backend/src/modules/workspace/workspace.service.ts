import { prisma } from '../../config/db.config.ts'
import type {
  CreateWorkspaceInput,
  GetWorkspaceDTO,
  WorkspaceDTO,
} from '../../types/workspace.types.ts'
import { ApiError } from '../../utils/apiError.ts'
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
