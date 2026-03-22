import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AssignedTask, Status, createTaskInput, GetTaskDTO } from './types'
import {
  getWorkspaceAssignedTasks,
  updateTaskStatus,
  listProjectTasks,
  getTaskById,
  createProjectTask,
  createPersonalTask,
  updateTask,
  cancelTask,
} from './api'
import { handleApiError } from '@/lib/handle-api-error'
import { TaskCreatePayload } from '@/components/tasks/taskcreatemodal'

export const formatTaskPayload = (
  payload: TaskCreatePayload,
  userId: number,
): createTaskInput => {
  if (payload.type === 'PROJECT' && payload.projectId) {
    return {
      taskType: payload.type,
      projectId: parseInt(payload.projectId),
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      assignedTo: userId,
    }
  } else if (payload.type === 'PERSONAL') {
    return {
      taskType: 'PERSONAL',
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      assignedTo: userId,
    }
  } else {
    throw new Error(`Invalid task type: ${payload.type}`)
  }
}

export const useWorkspaceAssignedTasks = (workspaceId: number) => {
  return useQuery<AssignedTask[]>({
    queryKey: ['workspace', workspaceId, 'myTasks'],
    queryFn: () => getWorkspaceAssignedTasks(workspaceId),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useProjectTasks = (
  projectId: number,
  filters?: {
    assignedTo?: number
    status?: string
    taskType?: string
  },
) => {
  return useQuery<AssignedTask[]>({
    queryKey: ['project', projectId, 'tasks', filters],
    queryFn: () => listProjectTasks(projectId, filters),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useTaskById = (projectId: number, taskId: number) => {
  return useQuery<GetTaskDTO>({
    queryKey: ['project', projectId, 'task', taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!projectId && !!taskId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateTask = (workspaceId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: createTaskInput) => {
      if (input.taskType === 'PROJECT') {
        if (!input.projectId) {
          throw new Error('projectId is required for PROJECT tasks')
        }
        return createProjectTask({
          taskType: input.taskType,
          projectId: input.projectId,
          title: input.title,
          description: input.description,
          assignedTo: input.assignedTo,
          priority: input.priority,
          dueDate: input.dueDate,
        })
      } else if (input.taskType === 'PERSONAL') {
        return createPersonalTask({
          taskType: input.taskType,
          title: input.title,
          description: input.description,
          assignedTo: input.assignedTo,
          priority: input.priority,
          dueDate: input.dueDate,
        })
      } else {
        throw new Error(`Invalid taskType: ${input.taskType}`)
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })
    },

    onError: err => {
      handleApiError(err)
    },
  })
}

export const useUpdateTask = (projectId: number, workspaceId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { taskId: number; data: Partial<createTaskInput> }) => {
      return updateTask(input.taskId, input.data)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId, 'tasks'] })
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })
    },

    onError: err => {
      handleApiError(err)
    },
  })
}

export const useUpdateTaskStatus = (workspaceId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) =>
      updateTaskStatus(taskId, status),

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })

      const previousTasks = queryClient.getQueryData<AssignedTask[]>([
        'workspace',
        workspaceId,
        'myTasks',
      ])

      queryClient.setQueryData<AssignedTask[]>(
        ['workspace', workspaceId, 'myTasks'],
        old =>
          old?.map(task =>
            task.id === taskId ? { ...task, status: status as Status } : task,
          ),
      )

      return { previousTasks }
    },
    onError: (err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['workspace', workspaceId, 'myTasks'],
          context.previousTasks,
        )
      }
      handleApiError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })
    },
  })
}

export const useCancelTask = (workspaceId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId }: { taskId: number }) => cancelTask(taskId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })
    },

    onError: err => {
      handleApiError(err)
    },
  })
}
