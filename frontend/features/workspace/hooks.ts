import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchUserWorkspaces, fetchWorkspaceById, sendWorkspaceInvite } from './api'

export const useSendWorkspaceInvite = () => {
  return useMutation({
    mutationFn: sendWorkspaceInvite,
  })
}

export const useListUserWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces', 'user'],
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