import api from '@/lib/api'
import {
  CreateProjectInput,
  ListAllWorkspaceProjectDTO,
  UpdateProjectInput,
} from './types'

export const listAllWorkspaceProjects = async (
  workspaceId: number,
): Promise<ListAllWorkspaceProjectDTO> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/projects`)

  return data.data
}

export const createProject = async (input: CreateProjectInput) => {
  const { data } = await api.post('/projects/', input)

  return data.data
}

export const updateProject = async (projectId: number, input: UpdateProjectInput) => {
  const { data } = await api.patch(`/projects/${projectId}`, input)

  return data.data
}

export const deleteProject = async (projectId: number) => {
  const { data } = await api.delete(`/projects/${projectId}`)

  return data.data
}
