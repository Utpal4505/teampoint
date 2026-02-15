import type { WorkspaceRole, WorkspaceStatus } from '../generated/prisma/enums.ts'

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
