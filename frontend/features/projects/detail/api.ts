import api from '@/lib/api'
import type { ProjectDetail, ProjectTask, ProjectDocument } from './types'

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

export const getProjectDocuments = async (projectId: number): Promise<ProjectDocument[]> => {
  const { data } = await api.get(`/projects/${projectId}/documents`)
  return data.data
}

export const getProjectMembers = async (projectId: number) => {
  const { data } = await api.get(`/projects/${projectId}/members`)
  return data.data
}

