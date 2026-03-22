import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createProject,
  listAllWorkspaceProjects,
  updateProject,
  deleteProject,
} from './api'
import { mapProjects } from './mapper'
import { handleApiError } from '@/lib/handle-api-error'
import { UpdateProjectInput } from './types'

const projectKeys = {
  all: ['projects'] as const,
  workspace: (id: number) => ['workspace', id, 'projects'] as const,
}

export const useListAllWorkspaceProjects = (workspaceId: number) => {
  return useQuery({
    queryKey: projectKeys.workspace(workspaceId),
    queryFn: async () => {
      const data = await listAllWorkspaceProjects(workspaceId)
      return mapProjects(data)
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProject,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.workspace(variables.workspaceId),
      })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      projectId,
      input,
    }: {
      projectId: number
      input: UpdateProjectInput
    }) => updateProject(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: projectKeys.all,
      })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}
