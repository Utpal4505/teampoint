import api from '@/lib/api'
import type { ListMeetingsResponse, MeetingStatus } from './types'

export const fetchWorkspaceMeetings = async (
  workspaceId: number,
  options?: { status?: MeetingStatus; from?: Date; to?: Date },
): Promise<ListMeetingsResponse> => {
  const params = new URLSearchParams()
  if (options?.status) params.append('status', options.status)
  if (options?.from) params.append('from', options.from.toISOString())
  if (options?.to) params.append('to', options.to.toISOString())

  const queryString = params.toString() ? `?${params.toString()}` : ''
  const { data } = await api.get<{ data: ListMeetingsResponse }>(
    `/workspaces/${workspaceId}/meetings${queryString}`,
  )

  return data.data
}
