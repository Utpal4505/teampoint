import api from '@/lib/api'
import { AssignedTask } from './types'

export const getWorkspaceAssignedTasks = async (
  workspaceId: number,
): Promise<AssignedTask[]> => {
  const res = await api.get(`/workspaces/${workspaceId}/my-tasks`)

  return res.data.data
}

export const updateTaskStatus = async (projectId: number, taskId: number, status: string) => {
  const res = await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
  return res.data.data;
};