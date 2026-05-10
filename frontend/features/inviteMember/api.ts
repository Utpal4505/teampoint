
import api from '@/lib/api'

export type ValidateInviteResponse = {
  inviteId: number
  email: string
  role: string
  workspaceId: number
  workspaceName: string
  invitedByName: string
  expiresAt: string | null
}

export type AcceptInviteResponse = {
  workspaceId: number
  userId: number
  role: string
}

export const validateInviteToken = async (
  tokenId: string,
  token: string,
): Promise<ValidateInviteResponse> => {
  const { data } = await api.get(
    `/workspaces/invites/validate/${tokenId}/${token}`,
  )
  return data.data
}

export const acceptInvite = async (
  tokenId: number,
  token: string,
): Promise<AcceptInviteResponse> => {
  const { data } = await api.post('/workspaces/invites/accept', {
    tokenId,
    token,
  })
  return data.data
}
