export type WorkspaceRole = 'ADMIN' | 'MEMBER'
export type WorkspaceStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED'

export type SendInviteDTO = {
  invitedBy: number
  workspaceId: number
  email: string
  role: WorkspaceRole
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'REVOKED'
  inviteLink: string
  expiredAt: Date | null
}

export type ListUserWorkspacesDTO = {
  id: number
  name: string
  description: string | null
  status: WorkspaceStatus
  role: WorkspaceRole
  joinedAt: Date
  createdAt: Date
}[]

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
      avatarUrl: string | null
    }
  }[]
  createdAt: Date
}

export type WorkspaceDTO = {
  id: number
  name: string
  description: string | null
  status: WorkspaceStatus
  createdAt: Date
}
