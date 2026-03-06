export type SendInviteDTO = {
  invitedBy: number
  workspaceId: number
  email: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'REVOKED'
  inviteLink: string
  expiredAt: Date | null
}
