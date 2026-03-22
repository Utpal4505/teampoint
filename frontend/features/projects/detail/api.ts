import api from '@/lib/api'
import type {
  ProjectDetail,
  ProjectTask,
  ProjectDocument,
  UpdateProjectMemberRoleInput,
} from './types'

export const getProjectById = async (projectId: number): Promise<ProjectDetail> => {
  const { data } = await api.get(`/projects/${projectId}`)
  return data.data
}

export const getProjectTasks = async (projectId: number): Promise<ProjectTask[]> => {
  const { data } = await api.get(`/projects/${projectId}/tasks`)
  return data.data
}

export const updateProjectTaskStatus = async (
  projectId: number,
  taskId: number,
  status: string,
): Promise<void> => {
  await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status })
}

export const getProjectDocuments = async (
  projectId: number,
): Promise<ProjectDocument[]> => {
  const { data } = await api.get(`/projects/${projectId}/documents`)
  return data.data
}

export const getProjectMembers = async (projectId: number) => {
  const { data } = await api.get(`/projects/${projectId}/members`)
  return data.data
}

export const addProjectMember = async (
  projectId: number,
  input: { email: string; role?: string },
) => {
  const { data } = await api.post(`/projects/${projectId}/members`, input)
  return data.data
}

export const updateProjectMember = async (
  projectId: number,
  userId: number,
  input: UpdateProjectMemberRoleInput,
) => {
  const { data } = await api.patch(`/projects/${projectId}/members/${userId}`, input)
  return data.data
}

export const removeProjectMember = async (projectId: number, userId: number) => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`)
  return data.data
}

export const exitProject = async (projectId: number) => {
  const { data } = await api.post(`/projects/${projectId}/members/exit`, {})
  return data.data
}
