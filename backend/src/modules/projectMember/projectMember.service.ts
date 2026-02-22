import { prisma } from '../../config/db.config.ts'
import { WorkspaceMemberStatus, WorkspaceRole } from '../../generated/prisma/enums.ts'
import type {
  AddProjectMemberDTO,
  AddProjectMemberInput,
  ListProjectMemberDTO,
  RemoveProjectMemberDTO,
  SelfLeaveProjectMemberDTo,
  UpdateProjectMemberRoleDTO,
  UpdateProjectMemberRoleInput,
} from '../../types/projectMember.type.ts'
import { ApiError } from '../../utils/apiError.ts'
import { ensureExists } from '../../utils/ensureExists.ts'
import { PROJECT_ROLE_PERMISSIONS } from '../project/project.permissions.ts'

export const addProjectMemberService = async (
  input: AddProjectMemberInput,
): Promise<AddProjectMemberDTO> => {
  const { projectId, userId, role } = input

  return prisma.$transaction(async tx => {
    const project = await tx.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        workspaceId: true,
        status: true,
      },
    })

    ensureExists(project, 'Project not found')

    if (project.status === 'DELETED') {
      throw new ApiError(400, 'Cannot add members to a deleted project')
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true, status: true },
    })

    ensureExists(user, 'User not found')

    if (user.status === 'INACTIVE' || user.status === 'BANNED') {
      throw new ApiError(400, 'Cannot add an inactive or banned user to project')
    }

    const workspaceMember = await tx.workspace_Members.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: project.workspaceId,
          userId,
        },
      },
      select: {
        status: true,
      },
    })

    if (!workspaceMember || workspaceMember.status === 'REMOVED') {
      throw new ApiError(
        400,
        'User is not an active member of the workspace. Add them to workspace first.',
      )
    }

    const existingMember = await tx.project_Members.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
      select: { status: true },
    })

    if (existingMember && existingMember.status !== 'REMOVED') {
      throw new ApiError(400, 'User is already a member of this project')
    }

    if (role === WorkspaceRole.OWNER) {
      const existingOwner = await tx.project_Members.findFirst({
        where: {
          projectId: projectId,
          role: WorkspaceRole.OWNER,
          status: { not: WorkspaceMemberStatus.REMOVED },
        },
        select: { id: true },
      })

      if (existingOwner) {
        throw new ApiError(400, 'Project already has an owner. Transfer ownership first.')
      }
    }

    if (existingMember && existingMember.status === 'REMOVED') {
      const updatedMember = await tx.project_Members.update({
        where: {
          projectId_userId: {
            projectId: projectId,
            userId: userId,
          },
        },
        data: {
          role,
          status: WorkspaceMemberStatus.ACTIVE,
          joinedAt: new Date(),
          updatedAt: new Date(),
        },
        select: {
          projectId: true,
          userId: true,
          role: true,
          joinedAt: true,
        },
      })

      return updatedMember as AddProjectMemberDTO
    }

    const projectMember = await tx.project_Members.create({
      data: {
        projectId,
        userId,
        role,
        status: WorkspaceMemberStatus.ACTIVE,
        joinedAt: new Date(),
        permissions: PROJECT_ROLE_PERMISSIONS[role],
      },
      select: {
        projectId: true,
        userId: true,
        role: true,
        joinedAt: true,
      },
    })

    return projectMember
  })
}

export const listProjectMembersService = async (
  projectId: number,
): Promise<ListProjectMemberDTO> => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true, status: true },
  })

  ensureExists(project, 'Project not found')

  if (project.status === 'DELETED') {
    throw new ApiError(400, 'Cannot list members of a deleted project')
  }

  const members = await prisma.project_Members.findMany({
    where: {
      projectId: projectId,
      status: { not: WorkspaceMemberStatus.REMOVED },
    },
    select: {
      projectId: true,
      userId: true,
      role: true,
      joinedAt: true,
      status: true,
      user: {
        select: {
          fullName: true,
        },
      },
    },
    orderBy: {
      joinedAt: 'asc',
    },
  })

  return members.map(member => ({
    projectId: member.projectId,
    userId: member.userId,
    fullName: member.user.fullName,
    role: member.role,
    joinedAt: member.joinedAt,
    status: member.status,
  }))
}

export const updateProjectMemberService = async (
  input: UpdateProjectMemberRoleInput,
): Promise<UpdateProjectMemberRoleDTO> => {
  const { projectId, userId, role, status } = input

  return prisma.$transaction(async tx => {
    const member = await tx.project_Members.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
      select: {
        projectId: true,
        userId: true,
        role: true,
        status: true,
      },
    })

    if (
      !member ||
      (member.status === WorkspaceMemberStatus.REMOVED &&
        status !== WorkspaceMemberStatus.ACTIVE)
    ) {
      throw new ApiError(404, 'Project member not found')
    }

    if (role && role === WorkspaceRole.OWNER && member.role !== WorkspaceRole.OWNER) {
      const existingOwner = await tx.project_Members.findFirst({
        where: {
          projectId: projectId,
          role: WorkspaceRole.OWNER,
          status: { not: WorkspaceMemberStatus.REMOVED },
        },
        select: { id: true },
      })

      if (existingOwner) {
        throw new ApiError(400, 'Project already has an owner. Transfer ownership first.')
      }
    }

    if (
      role &&
      role !== WorkspaceRole.OWNER &&
      member.role === WorkspaceRole.OWNER &&
      status !== WorkspaceMemberStatus.REMOVED
    ) {
      const ownerCount = await tx.project_Members.count({
        where: {
          projectId: projectId,
          role: WorkspaceRole.OWNER,
          status: { not: WorkspaceMemberStatus.REMOVED },
        },
      })

      if (ownerCount === 1) {
        throw new ApiError(400, 'Cannot remove the only owner from the project')
      }
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    }

    if (role !== undefined) {
      updateData.role = role
    }

    if (status !== undefined) {
      updateData.status = status
    }

    const updatedMember = await tx.project_Members.update({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
      data: updateData,
      select: {
        projectId: true,
        userId: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    })

    return updatedMember
  })
}

export const removeProjectMemberService = async (
  projectId: number,
  userId: number,
): Promise<RemoveProjectMemberDTO> => {
  return prisma.$transaction(async tx => {
    const member = await tx.project_Members.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
      select: {
        projectId: true,
        userId: true,
        role: true,
        status: true,
      },
    })

    if (!member || member.status === WorkspaceMemberStatus.REMOVED) {
      throw new ApiError(404, 'Project member not found')
    }

    if (member.role === WorkspaceRole.OWNER) {
      const ownerCount = await tx.project_Members.count({
        where: {
          projectId: projectId,
          role: WorkspaceRole.OWNER,
          status: { not: WorkspaceMemberStatus.REMOVED },
        },
      })

      if (ownerCount === 1) {
        throw new ApiError(400, 'Cannot remove the only owner from the project')
      }
    }

    const removedMember = await tx.project_Members.update({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
      data: {
        status: WorkspaceMemberStatus.REMOVED,
        updatedAt: new Date(),
      },
      select: {
        projectId: true,
        userId: true,
        status: true,
        updatedAt: true,
      },
    })

    return {
      projectId: removedMember.projectId,
      userId: removedMember.userId,
      status: removedMember.status,
      removedAt: removedMember.updatedAt,
    }
  })
}

export const selfExitProjectService = async (
  projectId: number,
  userId: number,
): Promise<SelfLeaveProjectMemberDTo> => {
  return prisma.$transaction(async tx => {
    const project = await tx.project.findUnique({
      where: { id: projectId },
      select: { id: true, status: true },
    })

    ensureExists(project, 'Project not found')

    const member = await tx.project_Members.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
      select: {
        projectId: true,
        userId: true,
        role: true,
        status: true,
      },
    })

    if (!member || member.status === WorkspaceMemberStatus.REMOVED) {
      throw new ApiError(404, 'You are not a member of this project')
    }

    if (member.role === WorkspaceRole.OWNER) {
      const ownerCount = await tx.project_Members.count({
        where: {
          projectId: projectId,
          role: WorkspaceRole.OWNER,
          status: { not: WorkspaceMemberStatus.REMOVED },
        },
      })

      if (ownerCount === 1) {
        throw new ApiError(
          400,
          'You are the only owner of this project. Transfer ownership to another member before leaving.',
        )
      }
    }

    const removedMember = await tx.project_Members.update({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: userId,
        },
      },
      data: {
        status: WorkspaceMemberStatus.REMOVED,
        updatedAt: new Date(),
      },
      select: {
        projectId: true,
        userId: true,
        status: true,
        updatedAt: true,
      },
    })

    return {
      projectId: removedMember.projectId,
      userId: removedMember.userId,
      status: removedMember.status,
      removedAt: removedMember.updatedAt,
    }
  })
}

export const isProjectMemberService = async (
  projectId: number,
  userId: number,
): Promise<boolean> => {
  const member = await prisma.project_Members.findUnique({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: userId,
      },
    },
    select: { status: true },
  })

  return member?.status === WorkspaceMemberStatus.ACTIVE
}

export const getProjectMemberRoleService = async (
  projectId: number,
  userId: number,
): Promise<WorkspaceRole | null> => {
  const member = await prisma.project_Members.findUnique({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: userId,
      },
    },
    select: {
      role: true,
      status: true,
    },
  })

  if (!member || member.status === WorkspaceMemberStatus.REMOVED) {
    return null
  }

  return member.role
}

export const canManageProjectMembersService = async (
  projectId: number,
  userId: number,
): Promise<boolean> => {
  const member = await prisma.project_Members.findUnique({
    where: {
      projectId_userId: {
        projectId: projectId,
        userId: userId,
      },
    },
    select: {
      role: true,
      status: true,
    },
  })

  if (!member || member.status === WorkspaceMemberStatus.REMOVED) {
    return false
  }

  return member.role === WorkspaceRole.OWNER || member.role === WorkspaceRole.ADMIN
}
