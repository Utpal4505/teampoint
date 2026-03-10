import { useQuery } from '@tanstack/react-query'
import { listAllWorkspaceProjects } from './api'

export const useListAllWorkspaceProjects = (workspaceId: number) => {
  return useQuery({
    queryKey: ['workspace', workspaceId, 'projects'],
    queryFn: () => listAllWorkspaceProjects(workspaceId),
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  })
}
