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
  getProjectMeetings,
  createMeeting,
  getMeeting,
  updateMeeting,
  completeMeeting,
  cancelMeeting,
} from './api'
import type {
  ProjectTask,
  TaskStatus,
  MeetingListItem,
  CreateMeetingInput,
  CompleteMeetingInput,
} from './types'
import { handleApiError } from '@/lib/handle-api-error'

const projectKeys = {
  detail: (id: number) => ['project', id] as const,
  tasks: (id: number) => ['project', id, 'tasks'] as const,
  documents: (id: number) => ['project', id, 'documents'] as const,
  members: (id: number) => ['project', id, 'members'] as const,
  meetings: (id: number) => ['project', id, 'meetings'] as const,
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
      role,
      status,
    }: {
      userId: number
      role?: string | null
      status?: string | null
    }) => {
      const input: {
        role?: string | null
        status?: string | null
      } = {}
      if (role !== undefined) input.role = role
      if (status !== undefined) input.status = status
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return updateProjectMember(projectId, userId, input as any)
    },
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
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useProjectMeetings = (projectId: number) =>
  useQuery({
    queryKey: projectKeys.meetings(projectId),
    queryFn: () => getProjectMeetings(projectId),
    enabled: !!projectId,
    staleTime: 1000 * 60 * 2,
  })

export const useCreateMeeting = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateMeetingInput) => createMeeting(projectId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.meetings(projectId) })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useGetMeeting = (projectId: number, meetingId: number) =>
  useQuery({
    queryKey: ['meeting', meetingId],
    queryFn: () => getMeeting(projectId, meetingId),
    enabled: !!projectId && !!meetingId,
  })

export const useUpdateMeeting = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      meetingId,
      input,
    }: {
      meetingId: number
      input: Partial<CreateMeetingInput>
    }) => updateMeeting(projectId, meetingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.meetings(projectId) })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useCompleteMeeting = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      meetingId,
      input,
    }: {
      meetingId: number
      input: CompleteMeetingInput
    }) => completeMeeting(projectId, meetingId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.meetings(projectId) })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}

export const useCancelMeeting = (projectId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (meetingId: number) => cancelMeeting(projectId, meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.meetings(projectId) })
    },
    onError: error => {
      handleApiError(error)
    },
  })
}
