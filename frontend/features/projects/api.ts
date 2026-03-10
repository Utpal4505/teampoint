import api from '@/lib/api'
import { ListAllWorkspaceProjectDTO } from './types'

export const listAllWorkspaceProjects = async (
  workspaceId: number,
): Promise<ListAllWorkspaceProjectDTO> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/projects`)

  return data.data
}
