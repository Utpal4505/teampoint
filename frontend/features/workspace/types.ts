export type SendInviteDTO = {
  invitedBy: number
  workspaceId: number
  email: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'REVOKED'
  inviteLink: string
  expiredAt: Date | null
}

export type ListUserWorkspacesDTO = {
  id: number
  name: string
  description: string | null
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED'
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: Date
  createdAt: Date
}[]

export type GetWorkspaceDTO = {
  id: number
  name: string
  description: string | null
  status: 'ACTIVE' | 'ARCHIVED' | 'DELETED'
  createdBy: number
  workspaceMembers: {
    role: 'OWNER' | 'ADMIN' | 'MEMBER'
    joinedAt: Date
    user: {
      id: number
      fullName: string
      avatarUrl: string | null
    }
  }[]
  createdAt: Date
}
