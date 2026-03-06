import api from '@/lib/api'
import { SendInviteDTO } from './types'

export const sendWorkspaceInvite = async ({
  workspaceId,
  email,
  role,
}: {
  workspaceId: number
  email: string
  role: 'ADMIN' | 'MEMBER'
}): Promise<SendInviteDTO> => {
  const { data } = await api.post(`/workspaces/${workspaceId}/invites`, {
    email,
    role,
  })

  return data.data
}
