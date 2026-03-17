import { useQuery } from '@tanstack/react-query'
import { listAllWorkspaceProjects } from './api'
import { mapProjects } from './mapper'

export const useListAllWorkspaceProjects = (workspaceId: number) => {
  return useQuery({
    queryKey: ['workspace', workspaceId, 'projects'],
    queryFn: async () => {
      const data = await listAllWorkspaceProjects(workspaceId)
      console.log(data)
      return mapProjects(data)
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 5,
  })
}
