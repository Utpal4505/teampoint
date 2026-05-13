import api from '@/lib/api'
import type {
  ProjectDetail,
  ProjectTask,
  ProjectDocument,
  ProjectMemberDTO,
  UpdateProjectMemberRoleInput,
  MeetingListItem,
  ProjectMeeting,
  CreateMeetingInput,
  CompleteMeetingInput,
} from './types'

export const getProjectById = async (projectId: number): Promise<ProjectDetail> => {
  const { data } = await api.get(`/projects/${projectId}`)
  return data.data
}

export const getProjectTasks = async (projectId: number): Promise<ProjectTask[]> => {
  const { data } = await api.get(`/projects/tasks/?projectId=${projectId}`)
  return data.data
}

export const updateProjectTaskStatus = async (
  taskId: number,
  status: string,
): Promise<void> => {
  await api.patch(`/projects/tasks/${taskId}/status`, { status })
}

export const getProjectDocuments = async (
  projectId: number,
): Promise<ProjectDocument[]> => {
  const { data } = await api.get(`/projects/${projectId}/documents`)
  return data.data
}

export const getProjectMembers = async (
  projectId: number,
): Promise<ProjectMemberDTO[]> => {
  const { data } = await api.get(`/projects/${projectId}/members`)
  return data.data ?? []
}

export const addProjectMember = async (
  projectId: number,
  input: { userId: number; role?: string },
): Promise<ProjectMemberDTO> => {
  const { data } = await api.post(`/projects/${projectId}/members`, input)
  return data.data
}

export const updateProjectMember = async (
  projectId: number,
  userId: number,
  input: Omit<UpdateProjectMemberRoleInput, 'projectId' | 'userId'>,
): Promise<ProjectMemberDTO> => {
  const { data } = await api.patch(`/projects/${projectId}/members/${userId}`, input)
  return data.data
}

export const removeProjectMember = async (
  projectId: number,
  userId: number,
): Promise<{ id: number }> => {
  const { data } = await api.delete(`/projects/${projectId}/members/${userId}`)
  return data.data
}

export const exitProject = async (projectId: number): Promise<{ success: boolean }> => {
  const { data } = await api.post(`/projects/${projectId}/members/exit`, {})
  return data.data
}

export const getProjectMeetings = async (
  projectId: number,
  status?: string,
): Promise<MeetingListItem[]> => {
  const params = new URLSearchParams()
  if (status) params.append('status', status)
  if (projectId) params.append('projectId', projectId.toString())
  const { data } = await api.get(`/projects/${projectId}/meetings?${params.toString()}`)
  return data.data.data ?? []
}

export const createMeeting = async (
  projectId: number,
  input: CreateMeetingInput,
): Promise<{ id: number; status: string; meetingLink: string; createdAt: string }> => {
  const { data } = await api.post(`/projects/${projectId}/meetings`, input)
  return data.data
}

export const getMeeting = async (
  projectId: number,
  meetingId: number,
): Promise<ProjectMeeting> => {
  const { data } = await api.get(`/projects/${projectId}/meetings/${meetingId}`)
  return data.data
}

export const updateMeeting = async (
  projectId: number,
  meetingId: number,
  input: Partial<CreateMeetingInput>,
): Promise<{ id: number; updated: string }> => {
  const { data } = await api.patch(`/projects/${projectId}/meetings/${meetingId}`, input)
  return data.data
}

export const completeMeeting = async (
  projectId: number,
  meetingId: number,
  input: CompleteMeetingInput,
): Promise<{ id: number; status: string; completedAt: string }> => {
  const { data } = await api.post(
    `/projects/${projectId}/meetings/${meetingId}/complete`,
    input,
  )
  return data.data
}

export const cancelMeeting = async (
  projectId: number,
  meetingId: number,
): Promise<{ id: number; status: string }> => {
  const { data } = await api.post(
    `/projects/${projectId}/meetings/${meetingId}/cancel`,
    {},
  )
  return data.data
}
