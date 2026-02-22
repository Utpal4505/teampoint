import { prisma } from '../../config/db.config.ts'
import type { ProjectStatus } from '../../generated/prisma/enums.ts'
import type {
  CreateProjectDTO,
  CreateProjectInput,
  DeleteProjectDTO,
  GetProjectDTO,
  ListAllWorkspaceProjectDTO,
  updateProjectDTO,
  UpdateProjectInput,
} from '../../types/project.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { PROJECT_ROLE_PERMISSIONS } from './project.permissions.ts'

export const createProjectService = async (
  input: CreateProjectInput,
): Promise<CreateProjectDTO> => {
  const { createdBy, name, workspaceId, description } = input

  const project = await prisma.$transaction(async tx => {
    const project = await tx.project.create({
      data: {
        name,
        workspaceId,
        description,
        createdBy,
      },
      select: {
        id: true,
        workspaceId: true,
        name: true,
        description: true,
        status: true,
        createdBy: true,
        createdAt: true,
      },
    })

    await tx.project_Members.create({
      data: {
        userId: createdBy,
        permissions: PROJECT_ROLE_PERMISSIONS.OWNER,
        projectId: project.id,
        role: 'OWNER',
        joinedAt: new Date(),
      },
    })

    return project
  })

  return project
}

export const getProjectByIdService = async (
  projectId: number,
): Promise<GetProjectDTO> => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
      status: {
        not: 'DELETED',
      },
    },
    select: {
      id: true,
      workspaceId: true,
      name: true,
      description: true,
      status: true,
      createdBy: true,
      projectMembers: {
        select: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          role: true,
          joinedAt: true,
        },
      },
      createdAt: true,
    },
  })

  if (!project) {
    throw new ApiError(404, 'Project not found')
  }

  return project
}

export const updateProjectService = async (
  input: UpdateProjectInput,
): Promise<updateProjectDTO> => {
  const { projectId, description, name, status } = input

  const updateData: {
    name?: string
    description?: string | null
    status?: ProjectStatus
    updatedAt?: Date
  } = {}

  if (name) updateData.name = name.trim()
  if (description !== undefined) updateData.description = description
  if (status !== undefined) updateData.status = status

  if (!name && description === undefined && status === undefined) {
    throw new ApiError(400, 'No fields to update')
  }

  updateData.updatedAt = new Date()

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      status: 'ACTIVE',
    },
  })

  if (!project) {
    throw new ApiError(404, 'Project not found')
  }

  return prisma.project.update({
    where: { id: projectId },
    data: updateData,
  })
}

export const deleteProjectService = async (
  projectId: number,
): Promise<DeleteProjectDTO> => {
  const result = await prisma.project.updateMany({
    where: {
      id: projectId,
      status: {
        in: ['ACTIVE', 'ARCHIVED', 'COMPLETED', 'ONHOLD'],
      },
    },
    data: {
      status: 'DELETED',
      deletedAt: new Date(),
    },
  })

  if (result.count === 0) {
    throw new ApiError(404, 'Project not found or cannot be deleted')
  }

  return {
    id: projectId,
    status: 'DELETED',
    deletedAt: new Date(),
  }
}

export const listAllWorkspaceProjectService = async (
  workspaceId: number,
  userId: number,
): Promise<ListAllWorkspaceProjectDTO> => {
  return prisma.project.findMany({
    where: {
      workspaceId,
      status: { not: 'DELETED' },
      OR: [
        {
          projectMembers: {
            some: { userId },
          },
        },
        {
          workspace: {
            workspaceMembers: {
              some: {
                userId,
                role: { in: ['OWNER', 'ADMIN'] },
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdBy: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
