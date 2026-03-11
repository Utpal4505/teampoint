import api from '@/lib/api'
import type { ProjectDetail, ProjectTask, ProjectDocument } from './types'

// Project
export const getProjectById = async (projectId: number): Promise<ProjectDetail> => {
  const { data } = await api.get(`/projects/${projectId}`)
  return data.data
}

// Tasks
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

// Documents
export const getProjectDocuments = async (projectId: number): Promise<ProjectDocument[]> => {
  const { data } = await api.get(`/projects/${projectId}/documents`)
  return data.data
}

// Members
export const getProjectMembers = async (projectId: number) => {
  const { data } = await api.get(`/projects/${projectId}/members`)
  return data.data
}