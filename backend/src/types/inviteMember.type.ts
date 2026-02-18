import type { InviteStatus, WorkspaceRole } from '../generated/prisma/enums.ts'

export type InviteEmailTemplateInput = {
  invitedByName: string
  workspaceName: string
  role: string
  inviteLink: string
  expiredAt: string
}

export type SendInviteInput = {
  workspaceId: number
  email: string
  role: WorkspaceRole
  invitedBy: number
}

export type GetInviteInput = {
  workspaceId: number
  inviteId: number
}

export type ListInvitesInput = {
  workspaceId: number
}

export type RevokeInviteInput = {
  workspaceId: number
  inviteId: number
}

export type AcceptInviteInput = {
  tokenId: number
  token: string
  userId: number
}

export type SendInviteDTO = {
  invitedBy: number
  workspaceId: number
  email: string
  role: WorkspaceRole
  status: InviteStatus
  inviteLink: string
  expiredAt: Date | null
}

export type GetInviteDTO = {
  inviteId: number
  workspaceId: number
  email: string
  role: WorkspaceRole
  status: InviteStatus
  createdBy: number
  createdAt: Date
  expiredAt: Date | null
}

export type ListInvitesDTO = {
  inviteId: number
  email: string
  role: WorkspaceRole
  status: InviteStatus
  createdAt: Date
  expiredAt: Date | null
}[]

export type RevokeInviteDTO = {
  inviteId: number
  status: InviteStatus
  revokedAt: Date
}

export type AcceptInviteDTO = {
  workspaceId: number
  userId: number
  role: WorkspaceRole
}
