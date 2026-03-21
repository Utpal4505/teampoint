import api from '@/lib/api'
import type {
  AssignedTask,
  createTaskInput,
  CreateTaskDTO,
  GetTaskDTO,
  UpdateTaskDTO,
  ChangeTaskStatusDTO,
  CancelTaskDTO,
} from './types'

export const getWorkspaceAssignedTasks = async (
  workspaceId: number,
): Promise<AssignedTask[]> => {
  const res = await api.get(`/workspaces/${workspaceId}/my-tasks`)

  return res.data.data
}

export const listProjectTasks = async (
  projectId: number,
  filters?: {
    assignedTo?: number
    status?: string
    taskType?: string
  },
): Promise<AssignedTask[]> => {
  const params = new URLSearchParams()
  if (filters?.assignedTo) params.append('assignedTo', filters.assignedTo.toString())
  if (filters?.status) params.append('status', filters.status)
  if (filters?.taskType) params.append('taskType', filters.taskType)

  const res = await api.get(`/projects/${projectId}/tasks?${params.toString()}`)

  return res.data.data
}

export const getTaskById = async (
  projectId: number,
  taskId: number,
): Promise<GetTaskDTO> => {
  const res = await api.get(`/projects/${projectId}/tasks/${taskId}`)

  return res.data.data
}

export const createProjectTask = async (
  projectId: number,
  input: Omit<createTaskInput, 'projectId'> & { projectId: number },
): Promise<CreateTaskDTO> => {
  const res = await api.post(`/projects/${projectId}/tasks`, input)

  return res.data.data
}

export const createPersonalTask = async (
  input: Omit<createTaskInput, 'projectId'>,
): Promise<CreateTaskDTO> => {
  const res = await api.post(`/personal-tasks`, input)

  return res.data.data
}

export const updateTask = async (
  projectId: number,
  taskId: number,
  data: Partial<createTaskInput>,
): Promise<UpdateTaskDTO> => {
  const res = await api.patch(`/projects/${projectId}/tasks/${taskId}`, data)

  return res.data.data
}

export const updateTaskStatus = async (
  projectId: number,
  taskId: number,
  status: string,
): Promise<ChangeTaskStatusDTO> => {
  const res = await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status })

  return res.data.data
}

export const cancelTask = async (
  projectId: number,
  taskId: number,
): Promise<CancelTaskDTO> => {
  const res = await api.post(`/projects/${projectId}/tasks/${taskId}/cancel`)

  return res.data.data
}
