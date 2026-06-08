import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkspace,
  fetchUserWorkspaces,
  fetchWorkspaceById,
  sendWorkspaceInvite,
  updateWorkspace,
  updateWorkspaceMemberRole,
  removeWorkspaceMember,
} from './api'

export const useSendWorkspaceInvite = () => {
  return useMutation({
    mutationFn: (payload: { workspaceId: number; email: string; role: string }) =>
      sendWorkspaceInvite({
        email: payload.email,
        role: payload.role as 'ADMIN' | 'MEMBER',
        workspaceId: payload.workspaceId,
      }),
  })
}

export const useListUserWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces', 'list'],
    queryFn: fetchUserWorkspaces,
    staleTime: 1000 * 60 * 5,
  })
}

export const useFetchWorkspaceById = (workspaceId?: number) => {
  return useQuery({
    queryKey: ['workspace', 'detail', workspaceId],
    queryFn: () => fetchWorkspaceById(workspaceId!),
    enabled: !!workspaceId,
  })
}

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { name: string; description?: string }) =>
      createWorkspace(payload.name, payload.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workspaceId,
      name,
      description,
    }: {
      workspaceId: number
      name: string
      description?: string
    }) => updateWorkspace(workspaceId, { name, description }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workspace', 'detail', variables.workspaceId],
      })
      queryClient.invalidateQueries({ queryKey: ['workspaces'] })
    },
  })
}

export const useUpdateWorkspaceMemberRole = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { workspaceId: number; targetUserId: number; role: 'ADMIN' | 'MEMBER' }) =>
      updateWorkspaceMemberRole(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'detail', variables.workspaceId] })
    },
  })
}

export const useRemoveWorkspaceMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: { workspaceId: number; targetUserId: number }) =>
      removeWorkspaceMember(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workspace', 'detail', variables.workspaceId] })
    },
  })
}
