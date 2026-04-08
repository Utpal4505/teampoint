export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'

export interface MeetingListItem {
  id: number
  title: string
  status: MeetingStatus
  startTime: string | Date
  endTime: string | Date
  meetingLink: string
  projectId: number
  participantCount: number
}

export interface ListMeetingsResponse {
  data: MeetingListItem[]
}
