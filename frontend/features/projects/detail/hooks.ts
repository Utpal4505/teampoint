import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getProjectById,
  getProjectDocuments,
  getProjectMembers,
  getProjectTasks,
  updateProjectTaskStatus,
  addProjectMember,
  updateProjectMember,
  removeProjectMember,
  exitProject,
} from './api'
import { ProjectTask, TaskStatus, UpdateProjectMemberRoleInput } from './types'
import { handleApiError } from '@/lib/handle-api-error'

const projectKeys = {
  detail: (id: number) => ['project', id] as const,
  tasks: (id: number) => ['project', id, 'tasks'] as const,
  documents: (id: number) => ['project', id, 'documents'] as const,
  members: (id: number) => ['project', id, 'members'] as const,
}

export const useProjectDetail = (projectId: number) =>
  useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  })

export const useProjectTasks = (projectId: number) =>
  useQuery({
    queryKey: projectKeys.tasks(projectId),
    queryFn: () => getProjectTasks(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 2,
  })

export const useProjectDocuments = (projectId: number) =>
  useQuery({
    queryKey: projectKeys.documents(projectId),
    queryFn: () => getProjectDocuments(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  })

export const useProjectMembers = (projectId: number) =>
  useQuery({
    queryKey: projectKeys.members(projectId),
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  })

export const useUpdateProjectTaskStatus = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: TaskStatus }) =>
      updateProjectTaskStatus(projectId, taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: projectKeys.tasks(projectId) })
      const previous = queryClient.getQueryData<ProjectTask[]>(
        projectKeys.tasks(projectId),
      )
      queryClient.setQueryData<ProjectTask[]>(projectKeys.tasks(projectId), old =>
        old?.map(t => (t.id === taskId ? { ...t, status } : t)),
      )
      return { previous }
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(projectKeys.tasks(projectId), context.previous)
      }
      handleApiError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.tasks(projectId) })
    },
  })
}

export const useAddProjectMember = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { email: string; role?: string }) =>
      addProjectMember(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useUpdateProjectMember = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      input,
    }: {
      userId: number
      input: UpdateProjectMemberRoleInput
    }) => updateProjectMember(projectId, userId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useRemoveProjectMember = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => removeProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useExitProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (projectId: number) => exitProject(projectId),
    onSuccess: (data, projectId) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(projectId) })
      // Also invalidate the projects list since user is no longer a member
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}
