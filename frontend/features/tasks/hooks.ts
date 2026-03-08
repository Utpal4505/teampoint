import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AssignedTask } from './types'
import { getWorkspaceAssignedTasks, updateTaskStatus } from './api'
import { toast } from 'sonner'

export const useWorkspaceAssignedTasks = (workspaceId: number) => {
  return useQuery<AssignedTask[]>({
    queryKey: ['workspace', workspaceId, 'myTasks'],
    queryFn: () => getWorkspaceAssignedTasks(workspaceId),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useUpdateTaskStatus = (workspaceId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      taskId,
      status,
    }: {
      projectId: number
      taskId: number
      status: string
    }) => updateTaskStatus(projectId, taskId, status),

    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })

      const previousTasks = queryClient.getQueryData<AssignedTask[]>([
        'workspace',
        workspaceId,
        'myTasks',
      ])

      queryClient.setQueryData<AssignedTask[]>(
        ['workspace', workspaceId, 'myTasks'],
        old => {
          return old?.map(task => (task.id === taskId ? { ...task, status } : task))
        },
      )

      return { previousTasks }
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['workspace', workspaceId, 'myTasks'],
          context.previousTasks,
        )
      }
      toast.error('Failed to update task status')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace', workspaceId, 'myTasks'] })
    },
  })
}
