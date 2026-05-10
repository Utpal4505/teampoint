import api from '@/lib/api'
import { ListUserWorkspacesDTO, SendInviteDTO, GetWorkspaceDTO } from './types'

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

export const fetchUserWorkspaces = async (): Promise<ListUserWorkspacesDTO> => {
  const { data } = await api.get('/workspaces/user-workspaces')

  return data.data
}

export const fetchWorkspaceById = async (workspaceId: number): Promise<GetWorkspaceDTO> => {
  const { data } = await api.get(`/workspaces/${workspaceId}`)
  return data.data
}

export const createWorkspace = async (name: string, description?: string) => {
  const { data } = await api.post('/workspaces/', {
    workspaceName: name,
    description,
  })

  return data.data
}

export const updateWorkspace = async (
  workspaceId: number,
  { name, description }: { name: string; description?: string },
) => {
  const { data } = await api.patch(`/workspaces/${workspaceId}`, {
    name,
    description,
  })

  return data.data
}
