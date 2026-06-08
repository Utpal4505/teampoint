import { useQuery } from '@tanstack/react-query'
import { fetchWorkspaceMeetings } from './api'
import type { MeetingStatus } from './types'

export const useWorkspaceMeetings = (
  workspaceId: number,
  options?: { status?: MeetingStatus; from?: Date; to?: Date },
) => {
  return useQuery({
    queryKey: [
      'workspace',
      'meetings',
      workspaceId,
      options?.status,
      options?.from,
      options?.to,
    ],
    queryFn: () => fetchWorkspaceMeetings(workspaceId, options),
    enabled: !!workspaceId,
  })
}

export const useTodaysMeetings = (workspaceId: number) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return useQuery({
    queryKey: ['workspace', 'meetings', 'today', workspaceId],
    queryFn: () =>
      fetchWorkspaceMeetings(workspaceId, {
        from: today,
        to: tomorrow,
      }),
    enabled: !!workspaceId,
  })
}
