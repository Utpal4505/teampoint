import type {
  UserStatus,
  WorkspaceMemberStatus,
  WorkspaceRole,
  WorkspaceStatus,
} from '../generated/prisma/enums.ts'
import type { ROLE_PERMISSIONS } from '../modules/workspace/workspace.permissions.ts'

export type CreateWorkspaceInput = {
  name: string
  description?: string
  ownerId: number
}

export type WorkspaceDTO = {
  id: number
  name: string
  description: string | null
  status: WorkspaceStatus
  createdAt: Date
}

export type GetWorkspaceDTO = {
  id: number
  name: string
  description: string | null
  status: WorkspaceStatus
  createdBy: number
  workspaceMembers: {
    role: WorkspaceRole
    joinedAt: Date
    user: {
      id: number
      fullName: string
      avatar_url: string | null
    }
  }[]
  createdAt: Date
}

export type UpdateWorkspaceInput = {
  workspaceId: number
  name?: string
  description?: string
}

export type updateWorkspaceDTO = {
  id: number
  name: string
  description: string | null
  updatedAt: Date
}

export type ArchiveWorkspaceDTO = {
  id: number
  status: WorkspaceStatus
  archivedAt: Date | null
}

export type DeleteWorkspaceDTO = {
  id: number
  status: WorkspaceStatus
  deletedAt: Date | null
}

export type WorkspacePermissionMap =
  (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS]

export type WorkspacePermissionOverride = Partial<WorkspacePermissionMap>

export type ListAllWorkspacesMemberDTO = {
  user: {
    id: number
    fullName: string
    avatar_url: string | null
    status: UserStatus
  }
  role: WorkspaceRole
  joinedAt: Date
}[]

export type RemoveWorkspaceMemberDTO = {
  userId: number
  role: WorkspaceRole
  status: WorkspaceMemberStatus
  updatedAt: Date
}
