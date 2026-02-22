import type { ProjectStatus, WorkspaceRole } from '../generated/prisma/enums.ts'
import type { PROJECT_ROLE_PERMISSIONS } from '../modules/project/project.permissions.ts'

export type CreateProjectInput = {
  workspaceId: number
  name: string
  description: string | null
  createdBy: number
}

export type CreateProjectDTO = {
  id: number
  workspaceId: number
  name: string
  description: string | null
  status: ProjectStatus
  createdBy: number
  createdAt: Date
}

export type GetProjectDTO = {
  id: number
  workspaceId: number
  name: string
  description: string | null
  status: ProjectStatus
  createdBy: number
  projectMembers: {
    role: WorkspaceRole
    joinedAt: Date
    user: {
      id: number
      fullName: string
      avatarUrl: string | null
    }
  }[]
  createdAt: Date
}

export type UpdateProjectInput = {
  projectId: number
  name?: string | null | undefined
  description?: string | null | undefined
  status?: ProjectStatus | undefined
}

export type updateProjectDTO = {
  id: number
  name: string
  description: string | null
  status: ProjectStatus
  updatedAt: Date
}

export type DeleteProjectDTO = {
  id: number
  status: ProjectStatus
  deletedAt: Date | null
}

export type ProjectPermissionMap =
  (typeof PROJECT_ROLE_PERMISSIONS)[keyof typeof PROJECT_ROLE_PERMISSIONS]

export type ProjectPermissionOverride = Partial<ProjectPermissionMap>

export type ListAllWorkspaceProjectDTO = {
  id: number
  name: string
  description: string | null
  status: ProjectStatus
  createdBy: number
  createdAt: Date
}[]
