import type { WorkspaceMemberStatus, WorkspaceRole } from '../generated/prisma/enums.ts'

export type AddProjectMemberInput = {
  userId: number
  projectId: number
  role: WorkspaceRole
}

export type AddProjectMemberDTO = {
  projectId: number
  userId: number
  role: WorkspaceRole
  joinedAt: Date
}

export type ListProjectMemberDTO = {
  projectId: number
  userId: number
  fullName: string
  role: WorkspaceRole
  joinedAt: Date
  status: WorkspaceMemberStatus
}[]

export type UpdateProjectMemberRoleInput = {
  projectId: number
  userId: number
  role: WorkspaceRole | null | undefined
  status: WorkspaceMemberStatus | null | undefined
}

export type UpdateProjectMemberRoleDTO = {
  projectId: number
  userId: number
  role: WorkspaceRole
  status: WorkspaceMemberStatus
  updatedAt: Date
}

export type RemoveProjectMemberDTO = {
  projectId: number
  userId: number
  status: WorkspaceMemberStatus
  removedAt: Date
}

export type SelfLeaveProjectMemberDTo = {
  projectId: number
  userId: number
  status: WorkspaceMemberStatus
  removedAt: Date
}
